"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "4000", 10),
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat_support",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
    accessTokenTtlMinutes: parseInt(process.env.ACCESS_TOKEN_TTL_MINUTES || "15", 10),
    refreshTokenTtlDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || "30", 10)
};
//# sourceMappingURL=env.js.map