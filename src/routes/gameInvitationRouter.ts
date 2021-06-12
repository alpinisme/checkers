import { Router } from "express";
import gameInvitationController from "../controllers/gameInvitationController";
import requireAuth from "../middleware/requireAuth";
import requireGameInvite from "../middleware/requireGameInvite";

const gameInvitationRouter = Router();

gameInvitationRouter.use(requireAuth);

gameInvitationRouter.use("/game-invite/:inviter", requireGameInvite);

gameInvitationRouter.get("/game-invite", gameInvitationController.index);

gameInvitationRouter.post(
    "/game-invite/:inviter",
    gameInvitationController.create
);

gameInvitationRouter.put(
    "/game-invite/:inviter",
    gameInvitationController.update
);

export default gameInvitationRouter;
