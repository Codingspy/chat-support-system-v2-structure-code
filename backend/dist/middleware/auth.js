"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(roles) {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization || "";
            const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
            if (!token) {
                return res.status(401).json({ message: "Missing Authorization header" });
            }
            const payload = (0, jwt_1.verifyAccessToken)(token);
            const user = { id: payload.sub, email: payload.email, role: payload.role };
            if (roles && roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.user = user;
            next();
        }
        catch (e) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
}
//# sourceMappingURL=auth.js.map