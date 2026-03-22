import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {
  registerContoller,
  verifyEmailController,
  loginController,
  getMeController,
  resendVerificationEmailController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerContoller);

authRouter.get("/verify-email", verifyEmailController);

authRouter.post("/login", loginValidator, loginController);

authRouter.get("/get-me", authMiddleware, getMeController);

authRouter.post("/resend-verification-email", resendVerificationEmailController);

export default authRouter;
