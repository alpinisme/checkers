import { NextFunction, Request, Response } from "express";
import chatInvitationStore from "../store/chatInvitationStore";

export default async function requireChatInvite(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { chatId } = req.params;
    const invitee: string = req.session.user.username;
    const hasInvite = await chatInvitationStore.exists(chatId, invitee);

    if (!hasInvite) {
        res.sendStatus(401);
    } else {
        next();
    }
}
