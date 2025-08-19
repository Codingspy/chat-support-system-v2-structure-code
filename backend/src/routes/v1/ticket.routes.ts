import { Router } from "express";
import { body, param } from "express-validator";
import { requireAuth } from "../../middleware/auth";
import { createTicket, deleteTicket, getTicket, listTickets, updateTicket } from "../../controllers/ticket.controller";

export const ticketRouter = Router();

ticketRouter.use(requireAuth(["user", "agent", "admin"]));

ticketRouter.get("/", listTickets);

ticketRouter.post(
  "/",
  [
    body("subject").isString().isLength({ min: 3 }),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("tags").optional().isArray(),
    body("initialMessage").optional().isString()
  ],
  createTicket
);

ticketRouter.get(
  "/:ticketId",
  [param("ticketId").isString().isLength({ min: 1 })],
  getTicket
);

ticketRouter.patch(
  "/:ticketId",
  [
    param("ticketId").isString().isLength({ min: 1 }),
    body("status").optional().isIn(["open", "pending", "resolved", "closed"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("tags").optional().isArray(),
    body("assignedTo").optional({ nullable: true }).isString()
  ],
  updateTicket
);

ticketRouter.delete(
  "/:ticketId",
  [param("ticketId").isString().isLength({ min: 1 })],
  deleteTicket
);


