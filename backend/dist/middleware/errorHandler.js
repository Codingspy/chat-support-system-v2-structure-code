"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    res.status(404).json({ message: "Not found" });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    const details = err.details || undefined;
    if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ message, details });
}
//# sourceMappingURL=errorHandler.js.map