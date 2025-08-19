import { NextFunction, Response } from "express";
import { AuthenticatedRequest, AuthUser } from "../types/express";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(roles?: ("user" | "agent" | "admin")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
      
      // Demo mode - allow demo-token for testing
      if (token === "demo-token") {
        const demoUser: AuthUser = { id: "demo-user", email: "demo@example.com", role: "user" };
        req.user = demoUser;
        return next();
      }
      
      if (!token) {
        return res.status(401).json({ message: "Missing Authorization header" });
      }
      
      const payload = verifyAccessToken(token);
      const user: AuthUser = { id: payload.sub, email: payload.email, role: payload.role };
      if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}


