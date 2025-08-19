"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../../controllers/auth.controller");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("name").isString().isLength({ min: 2 }),
    (0, express_validator_1.body)("password").isString().isLength({ min: 6 }),
    (0, express_validator_1.body)("role").optional().isIn(["user", "agent", "admin"])
], auth_controller_1.register);
exports.authRouter.post("/login", [(0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isString().isLength({ min: 6 })], auth_controller_1.login);
exports.authRouter.post("/refresh", auth_controller_1.refresh);
//# sourceMappingURL=auth.routes.js.map