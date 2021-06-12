import { Router } from "express";
import authenticationRouter from "./authenticationRouter";
import chatInvitationRouter from "./chatInvitationRouter";
import chatRouter from "./chatRouter";
import gameInvitationRouter from "./gameInvitationRouter";
import gameRouter from "./gameRouter";

const router = Router();

router.use(authenticationRouter);
router.use(gameRouter);
router.use(chatRouter);
router.use(gameInvitationRouter);
router.use(chatInvitationRouter);

export default router;
