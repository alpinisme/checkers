import { NextFunction, Request, Response } from "express";
import chatStore from "../store/chatStore";

export default async function requireChatOwnership(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const chatId = req.params.chatId;
    const username = req.session.user?.username;
    const isInRoom = await chatStore.isInRoom(chatId, username);

    if (!isInRoom) {
        res.sendStatus(401);
    } else {
        next();
    }
}
