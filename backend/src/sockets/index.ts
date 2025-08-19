import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";
import { Message } from "../models/Message";
import { Ticket } from "../models/Ticket";

interface ClientAuth {
  token?: string;
  userId?: string;
}

let ioInstance: Server | null = null;

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
}

export const io = {
  to: (room: string) => ({
    emit: (event: string, data: any) => {
      if (ioInstance) {
        ioInstance.to(room).emit(event, data);
      }
    }
  }),
  emit: (event: string, data: any) => {
    if (ioInstance) {
      ioInstance.emit(event, data);
    }
  }
};

export function registerSocketServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.clientOrigin,
      credentials: true
    }
  });
  ioInstance = io;

  io.on("connection", (socket) => {
    const auth = (socket.handshake.auth || {}) as ClientAuth;
    // Optionally validate token here for socket-level auth (JWT verify)

    socket.on("join:ticket", async (ticketId: string) => {
      socket.join(`ticket:${ticketId}`);
    });

    socket.on("message:send", async (payload: { ticketId: string; senderId: string; senderType: "user" | "agent"; content: string }) => {
      const message = await Message.create({
        ticketId: payload.ticketId,
        senderId: payload.senderId,
        senderType: payload.senderType,
        content: payload.content,
        status: "sent"
      });
      await Ticket.findByIdAndUpdate(payload.ticketId, { lastMessageAt: new Date() });
      io.to(`ticket:${payload.ticketId}`).emit("message:new", message);
    });

    socket.on("message:status", async (payload: { messageId: string; status: "delivered" | "read"; ticketId: string }) => {
      const updated = await Message.findByIdAndUpdate(payload.messageId, { status: payload.status }, { new: true });
      if (updated) {
        io.to(`ticket:${payload.ticketId}`).emit("message:status", updated);
      }
    });

    socket.on("typing:start", (data: { ticketId: string; userId: string }) => {
      io.to(`ticket:${data.ticketId}`).emit("typing:update", { ticketId: data.ticketId, userId: data.userId, typing: true });
    });

    socket.on("typing:stop", (data: { ticketId: string; userId: string }) => {
      io.to(`ticket:${data.ticketId}`).emit("typing:update", { ticketId: data.ticketId, userId: data.userId, typing: false });
    });

    socket.on("disconnect", () => {
      // noop
    });
  });

  return io;
}


