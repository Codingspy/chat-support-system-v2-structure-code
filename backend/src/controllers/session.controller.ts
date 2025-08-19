import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../types/express";
import { Session } from "../models/Session";
import { assertAccess, canAccessTicket } from "../utils/access";

export async function startSession(req: AuthenticatedRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", details: errors.array() });
  }
  const { ticketId, metadata } = req.body as { ticketId: string; metadata?: Record<string, unknown> };
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const session = await Session.create({ userId: req.user!.id, ticketId, metadata: metadata || null, startedAt: new Date() });
  return res.status(201).json(session);
}

export async function endSession(req: AuthenticatedRequest, res: Response) {
  const { sessionId } = req.params;
  const session = await Session.findByIdAndUpdate(sessionId, { endedAt: new Date() }, { new: true });
  if (!session) return res.status(404).json({ message: "Session not found" });
  assertAccess(await canAccessTicket(req.user!, session.ticketId.toString()));
  return res.json(session);
}

export async function listSessions(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.params;
  assertAccess(await canAccessTicket(req.user!, ticketId));
  const sessions = await Session.find({ ticketId }).sort({ startedAt: -1 });
  return res.json(sessions);
}


