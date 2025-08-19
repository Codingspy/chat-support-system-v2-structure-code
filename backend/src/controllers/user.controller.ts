import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { User } from "../models/User";

export async function me(req: AuthenticatedRequest, res: Response) {
  const user = await User.findById(req.user!.id).select("_id email name role createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt });
}


