import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createPaymentIntent, handleStripeWebhook } from '../controllers/stripeController.js';

const router = express.Router();
router.post('/create-payment-intent', auth, createPaymentIntent);


export default router;