"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = getIO;
exports.registerSocketServer = registerSocketServer;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const Message_1 = require("../models/Message");
const Ticket_1 = require("../models/Ticket");
let ioInstance = null;
function getIO() {
    if (!ioInstance) {
        throw new Error("Socket.IO not initialized");
    }
    return ioInstance;
}
function registerSocketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: env_1.env.clientOrigin,
            credentials: true
        }
    });
    ioInstance = io;
    io.on("connection", (socket) => {
        const auth = (socket.handshake.auth || {});
        // Optionally validate token here for socket-level auth (JWT verify)
        socket.on("join:ticket", async (ticketId) => {
            socket.join(`ticket:${ticketId}`);
        });
        socket.on("message:send", async (payload) => {
            const message = await Message_1.Message.create({
                ticketId: payload.ticketId,
                senderId: payload.senderId,
                senderType: payload.senderType,
                content: payload.content,
                status: "sent"
            });
            await Ticket_1.Ticket.findByIdAndUpdate(payload.ticketId, { lastMessageAt: new Date() });
            io.to(`ticket:${payload.ticketId}`).emit("message:new", message);
        });
        socket.on("message:status", async (payload) => {
            const updated = await Message_1.Message.findByIdAndUpdate(payload.messageId, { status: payload.status }, { new: true });
            if (updated) {
                io.to(`ticket:${payload.ticketId}`).emit("message:status", updated);
            }
        });
        socket.on("typing:start", (data) => {
            io.to(`ticket:${data.ticketId}`).emit("typing:update", { ticketId: data.ticketId, userId: data.userId, typing: true });
        });
        socket.on("typing:stop", (data) => {
            io.to(`ticket:${data.ticketId}`).emit("typing:update", { ticketId: data.ticketId, userId: data.userId, typing: false });
        });
        socket.on("disconnect", () => {
            // noop
        });
    });
    return io;
}
//# sourceMappingURL=index.js.map