"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessTicket = canAccessTicket;
exports.assertAccess = assertAccess;
const Ticket_1 = require("../models/Ticket");
async function canAccessTicket(user, ticketId) {
    if (user.role === "admin")
        return true;
    const ticket = await Ticket_1.Ticket.findById(ticketId).select("createdBy assignedTo");
    if (!ticket)
        return false;
    if (user.role === "user")
        return ticket.createdBy.toString() === user.id;
    if (user.role === "agent")
        return !ticket.assignedTo || ticket.assignedTo.toString() === user.id;
    return false;
}
function assertAccess(result) {
    if (!result) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
    }
}
//# sourceMappingURL=access.js.map