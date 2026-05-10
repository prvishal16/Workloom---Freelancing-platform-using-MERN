import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { createInvoice, getInvoiceForProject, payInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

const projectRouter = express.Router({ mergeParams: true });
projectRouter.post('/', auth, createInvoice);
projectRouter.get('/', auth, getInvoiceForProject);

router.patch('/:invoiceId/pay', auth, payInvoice);
export { router as invoiceRouter, projectRouter as projectInvoiceRouter };
