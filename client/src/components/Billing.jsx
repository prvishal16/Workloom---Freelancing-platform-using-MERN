import React from 'react';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Billing = ({ project, invoice, user, onInitiatePayment, clientSecret, onPaymentSuccess, onInvoiceCreate }) => {
  const [amount, setAmount] = React.useState(project.budget);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    onInvoiceCreate(amount);
  };
  
  if (user?._id === project.freelancer?._id) {
    if (invoice) {
      return ( <div className="bg-white p-6 rounded-lg shadow-md text-center"> <h3 className="text-xl font-semibold">Invoice Sent</h3> <p className="text-gray-600">Amount: ₹{invoice.amount}</p> <p className="mt-2 font-semibold capitalize">Status: <span className={invoice.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}>{invoice.status}</span></p> </div> );
    }
    return ( <form onSubmit={handleCreateInvoice} className="bg-white p-6 rounded-lg shadow-md"> <h3 className="text-xl font-semibold mb-4">Generate Final Invoice</h3> <p className="text-sm text-gray-500 mb-4">The final amount should match the project budget unless agreed otherwise.</p> <div> <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Invoice Amount (in INR)</label> <div className="relative mt-1"> <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span> <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7 block w-full border-gray-300 rounded-md" required /> </div> </div> <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"> Send Invoice to Client </button> </form> );
  }

  if (user?._id === project.client?._id) {
    if (!invoice) {
      return <div className="bg-white p-6 rounded-lg shadow-md text-center"><p className="text-gray-500">The freelancer has not yet generated an invoice.</p></div>;
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Invoice Received</h3>
            <div className="my-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Amount Due</p>
              <p className="text-3xl font-bold">₹{invoice.amount}</p>
            </div>
            
            {invoice.status === 'pending' && !clientSecret && (
              <button onClick={onInitiatePayment} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <DollarSign size={20} /> Proceed to Payment
              </button>
            )}

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={onPaymentSuccess} />
              </Elements>
            )}
        </div>
    );
  }

  return null;
};

export default Billing;