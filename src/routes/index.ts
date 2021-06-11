import { Router } from "express";
import authenticationRouter from "./authenticationRouter";
import chatRouter from "./chatRouter";
import gameRouter from "./gameRouter";

const router = Router();

router.use(authenticationRouter);
router.use(gameRouter);
router.use(chatRouter);

export default router;
