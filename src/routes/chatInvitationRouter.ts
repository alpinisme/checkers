import { Router } from "express";
import chatInvitationController from "../controllers/chatInvitationController";
import requireAuth from "../middleware/requireAuth";
import requireChatInvite from "../middleware/requireChatInvite";

const chatInvitationRouter = Router();

chatInvitationRouter.use(requireAuth);

chatInvitationRouter.use("/chat-invite/:chatId", requireChatInvite);

chatInvitationRouter.get("/chat-invite", chatInvitationController.index);

chatInvitationRouter.post(
    "/chat-invite/:chatId",
    chatInvitationController.create
);

chatInvitationRouter.put(
    "/chat-invite/:chatId",
    chatInvitationController.update
);

export default chatInvitationRouter;
