"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../middleware/auth");
const message_controller_1 = require("../../controllers/message.controller");
exports.messageRouter = (0, express_1.Router)();
exports.messageRouter.use((0, auth_1.requireAuth)(["user", "agent", "admin"]));
exports.messageRouter.get("/:ticketId", [(0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 })], message_controller_1.listMessages);
exports.messageRouter.post("/:ticketId", [(0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 }), (0, express_validator_1.body)("content").isString().isLength({ min: 1 })], message_controller_1.sendMessage);
exports.messageRouter.patch("/status/:messageId", [(0, express_validator_1.param)("messageId").isString().isLength({ min: 1 }), (0, express_validator_1.body)("status").isIn(["delivered", "read"])], message_controller_1.updateMessageStatus);
//# sourceMappingURL=message.routes.js.map