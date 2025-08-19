"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const sockets_1 = require("./sockets");
async function bootstrap() {
    await (0, db_1.connectToDatabase)();
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    (0, sockets_1.registerSocketServer)(server);
    server.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Fatal error during bootstrap:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map