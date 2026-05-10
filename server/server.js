import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { initSocket } from './socket.js';

import { handleStripeWebhook } from './controllers/stripeController.js';
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import projectProposalRoutes from './routes/projectProposalRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import deliverableRoutes from './routes/deliverableRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import projectMessageRoutes from './routes/projectMessageRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import projectReviewRoutes from './routes/projectReviewRoutes.js'; 
import userReviewRoutes from './routes/userReviewRoutes.js'; 
import { invoiceRouter, projectInvoiceRouter } from './routes/invoiceRoutes.js'; 
import stripeRoutes from './routes/stripeRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import upload from './config/cloudinary.js';

dotenv.config();
console.log('Stripe Secret Key Loaded:', process.env.STRIPE_SECRET_KEY); 
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.post(
  '/api/payments/stripe-webhook', 
  express.raw({ type: 'application/json' }), 
  handleStripeWebhook
);
app.use(express.json());
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/proposals', projectProposalRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/projects/:projectId/deliverables', deliverableRoutes);
app.use('/api/projects/:projectId/messages', messageRoutes);
app.use('/api/projects/:projectId/project-messages', projectMessageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects/:projectId/reviews', projectReviewRoutes); 
app.use('/api/users/:userId/reviews', userReviewRoutes); 
app.use('/api/projects/:projectId/invoices', projectInvoiceRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/payments', stripeRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const server = http.createServer(app);
initSocket(server);

console.log("--- SERVER STARTING UP - LOOK IN THIS TERMINAL FOR ERRORS ---");


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

