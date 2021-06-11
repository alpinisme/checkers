import { Router } from "express";
import chatController from "../controllers/chatController";
import requireAuth from "../middleware/requireAuth";
import requireChatMembership from "../middleware/requireChatOwnership";

const chatRouter = Router();

chatRouter.use(requireAuth);

chatRouter.use("/chat/:chatId", requireChatMembership);

chatRouter.get("/chat/:chatId", chatController.show);

chatRouter.put("/chat/:chatId", chatController.update);

export default chatRouter;
