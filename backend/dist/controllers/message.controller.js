"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMessages = listMessages;
exports.sendMessage = sendMessage;
exports.updateMessageStatus = updateMessageStatus;
const express_validator_1 = require("express-validator");
const Message_1 = require("../models/Message");
const Ticket_1 = require("../models/Ticket");
const sockets_1 = require("../sockets");
const access_1 = require("../utils/access");
async function listMessages(req, res) {
    const { ticketId } = req.params;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const messages = await Message_1.Message.find({ ticketId }).sort({ createdAt: 1 });
    return res.json(messages);
}
async function sendMessage(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", details: errors.array() });
    }
    const { ticketId } = req.params;
    const { content } = req.body;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const ticket = await Ticket_1.Ticket.findById(ticketId);
    if (!ticket)
        return res.status(404).json({ message: "Ticket not found" });
    const message = await Message_1.Message.create({ ticketId, senderId: req.user.id, senderType: req.user.role === "user" ? "user" : "agent", content, status: "sent" });
    ticket.lastMessageAt = new Date();
    await ticket.save();
    try {
        (0, sockets_1.getIO)().to(`ticket:${ticketId}`).emit("message:new", message);
    }
    catch { }
    return res.status(201).json(message);
}
async function updateMessageStatus(req, res) {
    const { messageId } = req.params;
    const { status } = req.body;
    const message = await Message_1.Message.findByIdAndUpdate(messageId, { status }, { new: true });
    if (!message)
        return res.status(404).json({ message: "Message not found" });
    try {
        (0, sockets_1.getIO)().to(`ticket:${req.body.ticketId || message.ticketId.toString()}`).emit("message:status", message);
    }
    catch { }
    return res.json(message);
}
//# sourceMappingURL=message.controller.js.map