import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { validationResult } from "express-validator";

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", details: errors.array() });
  }
  const { email, name, password, role } = req.body as { email: string; name: string; password: string; role?: "user" | "agent" | "admin" };
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const userCount = await User.countDocuments();
  const passwordHash = await bcrypt.hash(password, 10);
  const finalRole: "user" | "agent" | "admin" = userCount === 0 ? (role || "admin") : "user";
  const user = await User.create({ email, name, passwordHash, role: finalRole });
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role: user.role });
  return res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken
  });
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", details: errors.array() });
  }
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role: user.role });
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken
  });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const newRefreshToken = signRefreshToken({ sub: user.id, email: user.email, role: user.role });
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


