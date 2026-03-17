import { Router } from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { registerContoller } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerContoller);

export default authRouter;