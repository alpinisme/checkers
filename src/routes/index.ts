import { Router } from "express";
import authenticationRouter from "./authenticationRouter";

const router = Router();

router.use(authenticationRouter);

export default router;
