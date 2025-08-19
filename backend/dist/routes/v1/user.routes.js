"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const user_controller_1 = require("../../controllers/user.controller");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/me", (0, auth_1.requireAuth)(["user", "agent", "admin"]), user_controller_1.me);
//# sourceMappingURL=user.routes.js.map