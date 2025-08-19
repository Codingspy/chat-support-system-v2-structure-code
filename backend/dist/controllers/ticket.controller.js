"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = createTicket;
exports.listTickets = listTickets;
exports.getTicket = getTicket;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;
const express_validator_1 = require("express-validator");
const Ticket_1 = require("../models/Ticket");
const Message_1 = require("../models/Message");
const sockets_1 = require("../sockets");
const access_1 = require("../utils/access");
async function createTicket(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", details: errors.array() });
    }
    const { subject, priority, tags, initialMessage } = req.body;
    const ticket = await Ticket_1.Ticket.create({ subject, createdBy: req.user.id, priority: priority || "medium", tags: tags || [] });
    if (initialMessage) {
        await Message_1.Message.create({ ticketId: ticket.id, senderId: req.user.id, senderType: req.user.role === "user" ? "user" : "agent", content: initialMessage, status: "sent" });
    }
    try {
        (0, sockets_1.getIO)().emit("ticket:created", ticket);
    }
    catch { }
    return res.status(201).json(ticket);
}
async function listTickets(req, res) {
    const role = req.user.role;
    let query = {};
    if (role === "user") {
        query.createdBy = req.user.id;
    }
    else if (role === "agent") {
        query = { $or: [{ assignedTo: req.user.id }, { assignedTo: null }] };
    }
    const tickets = await Ticket_1.Ticket.find(query).sort({ updatedAt: -1 });
    return res.json(tickets);
}
async function getTicket(req, res) {
    const ticketId = req.params.ticketId;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const ticket = await Ticket_1.Ticket.findById(ticketId);
    if (!ticket)
        return res.status(404).json({ message: "Ticket not found" });
    return res.json(ticket);
}
async function updateTicket(req, res) {
    const ticketId = req.params.ticketId;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const updates = req.body;
    const ticket = await Ticket_1.Ticket.findByIdAndUpdate(ticketId, updates, { new: true });
    if (!ticket)
        return res.status(404).json({ message: "Ticket not found" });
    try {
        (0, sockets_1.getIO)().emit("ticket:updated", ticket);
    }
    catch { }
    return res.json(ticket);
}
async function deleteTicket(req, res) {
    const ticketId = req.params.ticketId;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const ticket = await Ticket_1.Ticket.findByIdAndDelete(ticketId);
    if (!ticket)
        return res.status(404).json({ message: "Ticket not found" });
    await Message_1.Message.deleteMany({ ticketId: ticket.id });
    try {
        (0, sockets_1.getIO)().emit("ticket:deleted", { id: ticket.id });
    }
    catch { }
    return res.json({ success: true });
}
//# sourceMappingURL=ticket.controller.js.map