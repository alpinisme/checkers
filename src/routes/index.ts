import { Router } from "express";
import authenticationRouter from "./authenticationRouter";
import gameRouter from "./gameRouter";

const router = Router();

router.use(authenticationRouter);
router.use(gameRouter);

export default router;
