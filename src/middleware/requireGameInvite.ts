import { NextFunction, Request, Response } from "express";
import gameInvitationStore from "../store/gameInvitationStore";

export default async function requireGameInvite(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { inviter } = req.params;
    const invitee: string = req.session.user.username;
    const hasInvite = await gameInvitationStore.exists(inviter, invitee);

    if (!hasInvite) {
        res.sendStatus(401);
    } else {
        next();
    }
}
