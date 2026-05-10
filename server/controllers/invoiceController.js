import Invoice from "../models/Invoice.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";

export const getInvoiceForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const invoice = await Invoice.findOne({ project: projectId });
    if (!invoice) {
      return res.json(null);
    }
    res.json(invoice);
  } catch (err) {
    console.error("Get invoice error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount } = req.body;
    const freelancerId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (!project.freelancer || !project.freelancer.equals(freelancerId)) {
      return res
        .status(403)
        .json({ error: "You are not the freelancer for this project." });
    }
    if (project.status !== "in-progress") {
      return res.status(400).json({
        error: "Invoices can only be created for in-progress projects.",
      });
    }

    const newInvoice = new Invoice({
      project: projectId,
      client: project.client,
      freelancer: freelancerId,
      amount,
    });
    await newInvoice.save();

    const notification = new Notification({
      recipient: project.client,
      sender: freelancerId,
      type: "new_invoice", 
      link: `/project/${projectId}`,
    });
    await notification.save();
    const io = getIO();
    io.to(project.client.toString()).emit("newNotification", {
      message: `You have a new invoice from ${req.user.name} for "${project.title}".`,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "An invoice for this project already exists." });
    }
    console.error("Create invoice error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const payInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const clientId = req.user._id;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found." });
    }
    if (!invoice.client.equals(clientId)) {
      return res
        .status(403)
        .json({ error: "You are not the client for this project." });
    }
    if (invoice.status === "paid") {
      return res
        .status(400)
        .json({ error: "This invoice has already been paid." });
    }

    invoice.status = "paid";
    await invoice.save();

    await Project.findByIdAndUpdate(invoice.project, { status: "completed" });

    const project = await Project.findById(invoice.project);
    const notification = new Notification({
      recipient: invoice.freelancer,
      sender: clientId,
      type: "invoice_paid",
      link: `/project/${invoice.project}`,
    });
    await notification.save();
    const io = getIO();
    io.to(invoice.freelancer.toString()).emit("newNotification", {
      message: `Your invoice for "${project.title}" has been paid!`,
    });

    res.json(invoice);
  } catch (err) {
    console.error("Pay invoice error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
