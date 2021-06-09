import { Router } from "express";
import authenticationRouter from "./authenticationRoutes";

const router = Router();

router.use(authenticationRouter);

export default router;
