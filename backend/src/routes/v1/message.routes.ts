import { Router } from "express";
import { body, param } from "express-validator";
import { requireAuth } from "../../middleware/auth";
import { listMessages, sendMessage, updateMessageStatus } from "../../controllers/message.controller";

export const messageRouter = Router();

messageRouter.use(requireAuth(["user", "agent", "admin"]));

messageRouter.get(
  "/:ticketId",
  [param("ticketId").isString().isLength({ min: 1 })],
  listMessages
);

messageRouter.post(
  "/:ticketId",
  [param("ticketId").isString().isLength({ min: 1 }), body("content").isString().isLength({ min: 1 })],
  sendMessage
);

messageRouter.patch(
  "/status/:messageId",
  [param("messageId").isString().isLength({ min: 1 }), body("status").isIn(["delivered", "read"])],
  updateMessageStatus
);


