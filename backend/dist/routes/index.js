"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./v1/auth.routes");
const ticket_routes_1 = require("./v1/ticket.routes");
const message_routes_1 = require("./v1/message.routes");
const session_routes_1 = require("./v1/session.routes");
const user_routes_1 = require("./v1/user.routes");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use("/v1/auth", auth_routes_1.authRouter);
exports.apiRouter.use("/v1/tickets", ticket_routes_1.ticketRouter);
exports.apiRouter.use("/v1/messages", message_routes_1.messageRouter);
exports.apiRouter.use("/v1/sessions", session_routes_1.sessionRouter);
exports.apiRouter.use("/v1/users", user_routes_1.userRouter);
//# sourceMappingURL=index.js.map