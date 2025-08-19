import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { me } from "../../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/me", requireAuth(["user", "agent", "admin"]), me);


