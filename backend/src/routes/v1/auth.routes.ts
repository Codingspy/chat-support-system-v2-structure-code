import { Router } from "express";
import { body } from "express-validator";
import { login, refresh, register } from "../../controllers/auth.controller";

export const authRouter = Router();

authRouter.post(
  "/register",
  [
    body("email").isEmail(),
    body("name").isString().isLength({ min: 2 }),
    body("password").isString().isLength({ min: 6 }),
    body("role").optional().isIn(["user", "agent", "admin"]) 
  ],
  register
);

authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 6 })],
  login
);

authRouter.post("/refresh", refresh);


