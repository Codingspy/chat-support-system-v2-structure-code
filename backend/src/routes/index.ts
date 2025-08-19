import { Router } from "express";
import { authRouter } from "./v1/auth.routes";
import { ticketRouter } from "./v1/ticket.routes";
import { messageRouter } from "./v1/message.routes";
import { sessionRouter } from "./v1/session.routes";
import { userRouter } from "./v1/user.routes";

export const apiRouter = Router();

apiRouter.use("/v1/auth", authRouter);
apiRouter.use("/v1/tickets", ticketRouter);
apiRouter.use("/v1/messages", messageRouter);
apiRouter.use("/v1/sessions", sessionRouter);
apiRouter.use("/v1/users", userRouter);


