import { Router } from "express";
import { body, param } from "express-validator";
import { requireAuth } from "../../middleware/auth";
import { endSession, listSessions, startSession } from "../../controllers/session.controller";

export const sessionRouter = Router();

sessionRouter.use(requireAuth(["user", "agent", "admin"]));

sessionRouter.post(
  "/start",
  [body("ticketId").isString().isLength({ min: 1 }), body("metadata").optional().isObject()],
  startSession
);

sessionRouter.post(
  "/end/:sessionId",
  [param("sessionId").isString().isLength({ min: 1 })],
  endSession
);

sessionRouter.get(
  "/ticket/:ticketId",
  [param("ticketId").isString().isLength({ min: 1 })],
  listSessions
);


