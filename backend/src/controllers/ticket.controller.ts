import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../types/express";
import { Ticket } from "../models/Ticket";
import { Message } from "../models/Message";
import { io } from "../sockets";
import { assertAccess, canAccessTicket } from "../utils/access";

// Simple AI welcome message generator
function generateWelcomeMessage(subject: string): string {
  return `Hello! 👋 Thank you for creating a support ticket: "${subject}". I'm here to help you with any questions or issues you may have. Please let me know how I can assist you today!`;
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", details: errors.array() });
  }
  
  const { subject, priority = "medium", tags = [], initialMessage } = req.body as {
    subject: string;
    priority?: "low" | "medium" | "high";
    tags?: string[];
    initialMessage?: string;
  };
  
  const user = req.user!;
  
  try {
    // Create the ticket
    const ticket = await Ticket.create({
      subject,
      priority,
      tags,
      status: "open",
      createdBy: user.id,
      assignedTo: null
    });

    // If there's an initial message, create it
    if (initialMessage) {
      const message = new Message({
        ticketId: ticket._id,
        content: initialMessage,
        senderType: "user",
        senderId: user.id,
        status: "sent"
      });
      await message.save();
      
      // Emit the initial message
      io.to(ticket._id.toString()).emit("message:new", message);
    }

    // Create a welcome AI message
    const welcomeMessage = new Message({
      ticketId: ticket._id,
      content: generateWelcomeMessage(subject),
      senderType: "agent",
      senderId: "ai-support",
      status: "sent"
    });
    await welcomeMessage.save();

    // Emit the welcome message after a short delay
    setTimeout(() => {
      io.to(ticket._id.toString()).emit("message:new", welcomeMessage);
    }, 500);

    // Emit ticket creation event
    io.emit("ticket:created", ticket);

    return res.status(201).json(ticket);
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ message: "Failed to create ticket" });
  }
}

export async function listTickets(req: AuthenticatedRequest, res: Response) {
  // In demo mode, show all tickets
  const tickets = await Ticket.find().sort({ updatedAt: -1 });
  return res.json(tickets);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const ticketId = req.params.ticketId;
  // In demo mode, allow access to all tickets
  if (req.user?.id === "demo-user") {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    return res.json(ticket);
  }
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  return res.json(ticket);
}

export async function updateTicket(req: AuthenticatedRequest, res: Response) {
  const ticketId = req.params.ticketId;
  // In demo mode, allow access to all tickets
  if (req.user?.id === "demo-user") {
    const updates = req.body as Partial<{ subject: string; status: string; priority: string; tags: string[]; assignedTo: string | null }>;
    const ticket = await Ticket.findByIdAndUpdate(ticketId, updates, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    try { io.emit("ticket:updated", ticket); } catch {}
    return res.json(ticket);
  }
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const updates = req.body as Partial<{ subject: string; status: string; priority: string; tags: string[]; assignedTo: string | null }>;
  const ticket = await Ticket.findByIdAndUpdate(ticketId, updates, { new: true });
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  try { io.emit("ticket:updated", ticket); } catch {}
  return res.json(ticket);
}

export async function deleteTicket(req: AuthenticatedRequest, res: Response) {
  const ticketId = req.params.ticketId;
  // In demo mode, allow access to all tickets
  if (req.user?.id === "demo-user") {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    await Message.deleteMany({ ticketId: ticket.id });
    try { io.emit("ticket:deleted", { id: ticket.id }); } catch {}
    return res.json({ success: true });
  }
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const ticket = await Ticket.findByIdAndDelete(ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  await Message.deleteMany({ ticketId: ticket.id });
  try { io.emit("ticket:deleted", { id: ticket.id }); } catch {}
  return res.json({ success: true });
}


