import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

export const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { invoiceId } = req.body;
    const userId = req.user._id;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'This invoice has already been paid.' });
    }
    if (!invoice.client.equals(userId)) {
        return res.status(403).json({ error: "Forbidden: You are not the client for this invoice." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount * 100,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        invoiceId: invoice._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error('Stripe payment intent error:', err.message);
    res.status(500).json({ error: 'Failed to create payment intent.' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('--- PaymentIntent Succeeded Event Received ---');

      const invoiceId = paymentIntent.metadata.invoiceId;
      console.log('Metadata from Stripe:', paymentIntent.metadata);
      console.log('Extracted invoiceId:', invoiceId);

      if (!invoiceId) {
        console.error('CRITICAL: invoiceId is missing from webhook metadata!');
        break; 
      }
      
      try {
        console.log('Attempting to find invoice with ID:', invoiceId);
        const invoice = await Invoice.findById(invoiceId);
        console.log('Invoice found in DB:', invoice);

        if (invoice && invoice.status !== 'paid') {
          console.log('Invoice is valid. Updating status to "paid"...');
          invoice.status = 'paid';
          await invoice.save();

          console.log('Updating project status to "completed"...');
          const project = await Project.findByIdAndUpdate(invoice.project, {
            status: 'completed',
          });
          console.log('Project status updated.');

          const notification = new Notification({
            recipient: invoice.freelancer,
            sender: invoice.client,
            type: 'invoice_paid',
            link: `/project/${invoice.project}`,
          });
          await notification.save();
          
          const io = getIO();
          io.to(invoice.freelancer.toString()).emit('newNotification', {
            message: `Your invoice for "${project.title}" has been paid!`,
          });
          console.log('Notification sent.');

        } else {
          console.log('Update skipped: Invoice not found, or its status was already "paid".');
        }
      } catch (dbError) {
        console.error('Error during database update:', dbError);
        return res.sendStatus(500);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};