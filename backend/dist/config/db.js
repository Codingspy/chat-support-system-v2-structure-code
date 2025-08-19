"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectToDatabase() {
    const uri = env_1.env.mongoUri;
    await mongoose_1.default.connect(uri, {
        autoIndex: env_1.env.nodeEnv !== "production"
    });
}
//# sourceMappingURL=db.js.map