"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../middleware/auth");
const session_controller_1 = require("../../controllers/session.controller");
exports.sessionRouter = (0, express_1.Router)();
exports.sessionRouter.use((0, auth_1.requireAuth)(["user", "agent", "admin"]));
exports.sessionRouter.post("/start", [(0, express_validator_1.body)("ticketId").isString().isLength({ min: 1 }), (0, express_validator_1.body)("metadata").optional().isObject()], session_controller_1.startSession);
exports.sessionRouter.post("/end/:sessionId", [(0, express_validator_1.param)("sessionId").isString().isLength({ min: 1 })], session_controller_1.endSession);
exports.sessionRouter.get("/ticket/:ticketId", [(0, express_validator_1.param)("ticketId").isString().isLength({ min: 1 })], session_controller_1.listSessions);
//# sourceMappingURL=session.routes.js.map