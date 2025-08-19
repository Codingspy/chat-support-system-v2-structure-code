"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSession = startSession;
exports.endSession = endSession;
exports.listSessions = listSessions;
const express_validator_1 = require("express-validator");
const Session_1 = require("../models/Session");
const access_1 = require("../utils/access");
async function startSession(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", details: errors.array() });
    }
    const { ticketId, metadata } = req.body;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const session = await Session_1.Session.create({ userId: req.user.id, ticketId, metadata: metadata || null, startedAt: new Date() });
    return res.status(201).json(session);
}
async function endSession(req, res) {
    const { sessionId } = req.params;
    const session = await Session_1.Session.findByIdAndUpdate(sessionId, { endedAt: new Date() }, { new: true });
    if (!session)
        return res.status(404).json({ message: "Session not found" });
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, session.ticketId.toString()));
    return res.json(session);
}
async function listSessions(req, res) {
    const { ticketId } = req.params;
    (0, access_1.assertAccess)(await (0, access_1.canAccessTicket)(req.user, ticketId));
    const sessions = await Session_1.Session.find({ ticketId }).sort({ startedAt: -1 });
    return res.json(sessions);
}
//# sourceMappingURL=session.controller.js.map