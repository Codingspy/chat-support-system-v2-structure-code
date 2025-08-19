"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const express_validator_1 = require("express-validator");
async function register(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", details: errors.array() });
    }
    const { email, name, password, role } = req.body;
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: "Email already in use" });
    }
    const userCount = await User_1.User.countDocuments();
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const finalRole = userCount === 0 ? (role || "admin") : "user";
    const user = await User_1.User.create({ email, name, passwordHash, role: finalRole });
    const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id, email: user.email, role: user.role });
    return res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken,
        refreshToken
    });
}
async function login(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", details: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id, email: user.email, role: user.role });
    return res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken,
        refreshToken
    });
}
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Missing refresh token" });
    }
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const user = await User_1.User.findById(payload.sub);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, email: user.email, role: user.role });
        const newRefreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id, email: user.email, role: user.role });
        return res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (e) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
//# sourceMappingURL=auth.controller.js.map