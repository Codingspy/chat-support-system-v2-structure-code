import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../types/express";
import { Message } from "../models/Message";
import { Ticket } from "../models/Ticket";
import { io } from "../sockets";
import { assertAccess, canAccessTicket } from "../utils/access";

export async function listMessages(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.params;
  // In demo mode, allow access to all tickets
  if (req.user?.id === "demo-user") {
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });
    return res.json(messages);
  }
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });
  return res.json(messages);
}

// Simple AI response generator
function generateAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return "Hello! 👋 Thank you for reaching out to our support team. How can I help you today?";
  }
  
  // Help responses
  if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! 🛠️ Please let me know what specific issue you're experiencing, and I'll do my best to assist you.";
  }
  
  // Technical issues
  if (message.includes('error') || message.includes('bug') || message.includes('problem')) {
    return "I understand you're experiencing an issue. 🔧 Could you please provide more details about the problem you're facing? This will help me assist you better.";
  }
  
  // Account related
  if (message.includes('account') || message.includes('login') || message.includes('password')) {
    return "For account-related issues, I can help guide you through the process. 🔐 Could you please specify what exactly you need help with regarding your account?";
  }
  
  // Payment related
  if (message.includes('payment') || message.includes('billing') || message.includes('charge') || message.includes('money')) {
    return "I can help you with payment and billing questions. 💳 Please provide more details about your billing inquiry.";
  }
  
  // General response
  return "Thank you for your message! 📝 I'm here to assist you. Please let me know how I can help, and I'll make sure to get back to you as soon as possible.";
}

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;
    const user = req.user!;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Create the user message
    const message = new Message({
      ticketId,
      content,
      senderType: user.role === "agent" ? "agent" : "user",
      senderId: user.id,
      status: "sent"
    });

    await message.save();

    // Emit the message to all connected clients
    io.to(ticketId).emit("message:new", message);

    // If this is a user message (not an agent), generate an auto-reply
    if (user.role === "user") {
      const aiResponse = generateAIResponse(content);
      
      // Create AI agent response
      const aiMessage = new Message({
        ticketId,
        content: aiResponse,
        senderType: "agent",
        senderId: "ai-support", // Special ID for AI responses
        status: "sent"
      });

      await aiMessage.save();

      // Emit the AI response after a short delay to make it feel more natural
      setTimeout(() => {
        io.to(ticketId).emit("message:new", aiMessage);
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    }

    res.status(201).json(message);
  } catch (error: any) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export async function updateMessageStatus(req: AuthenticatedRequest, res: Response) {
  const { messageId } = req.params;
  const { status } = req.body as { status: "delivered" | "read" };
  const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });
  if (!message) return res.status(404).json({ message: "Message not found" });
  try {
    io.to(message.ticketId.toString()).emit("message:status", message);
  } catch {}
  return res.json(message);
}


