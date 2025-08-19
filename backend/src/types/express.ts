import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  role: "user" | "agent" | "admin";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}


