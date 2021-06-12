import { NextFunction, Request, Response } from "express";
import chatService from "../services/chatService";

export default async function requireChatOwnership(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { chatId } = req.params;
    const { username } = req.session.user;
    const isInRoom = await chatService.isInRoom(chatId, username);

    if (!isInRoom) {
        res.sendStatus(401);
    } else {
        next();
    }
}
