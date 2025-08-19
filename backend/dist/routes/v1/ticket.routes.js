"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../middleware/auth");
const ticket_controller_1 = require("../../controllers/ticket.controller");
exports.ticketRouter = (0, express_1.Router)();
exports.ticketRouter.use((0, auth_1.requireAuth)(["user", "agent", "admin"]));
exports.ticketRouter.get("/", ticket_controller_1.listTickets);
exports.ticketRouter.post("/", [
    (0, express_validator_1.body)("subject").isString().isLength({ min: 3 }),
    (0, express_validator_1.body)("priority").optional().isIn(["low", "medium", "high"]),
    (0, express_validator_1.body)("tags").optional().isArray(),
    (0, express_validator_1.body)("initialMessage").optional().isString()
], ticket_controller_1.createTicket);
exports.ticketRouter.get("/:ticketId", [(0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 })], ticket_controller_1.getTicket);
exports.ticketRouter.patch("/:ticketId", [
    (0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 }),
    (0, express_validator_1.body)("status").optional().isIn(["open", "pending", "resolved", "closed"]),
    (0, express_validator_1.body)("priority").optional().isIn(["low", "medium", "high"]),
    (0, express_validator_1.body)("tags").optional().isArray(),
    (0, express_validator_1.body)("assignedTo").optional({ nullable: true }).isString()
], ticket_controller_1.updateTicket);
exports.ticketRouter.delete("/:ticketId", [(0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 })], ticket_controller_1.deleteTicket);
//# sourceMappingURL=ticket.routes.js.map