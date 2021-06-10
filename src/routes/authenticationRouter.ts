import { Router } from "express";
import { validateLogin, validateRegistration } from "../middleware/validations";
import authenticationController from "../controllers/authenticationController";

const authenticationRouter = Router();

authenticationRouter.post(
    "/login",
    validateLogin,
    authenticationController.login
);

authenticationRouter.post(
    "/register",
    validateRegistration,
    authenticationController.register
);

authenticationRouter.post("/logout", authenticationController.logout);

export default authenticationRouter;
