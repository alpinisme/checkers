import { Request, Response } from "express";
import gameService from "../services/gameService";
import gameInvitationStore from "../store/gameInvitationStore";

export default {
    async index(req: Request, res: Response) {
        const { chatInvitationId } = req.params;
        const chat = await gameInvitationStore.all(chatInvitationId);
        res.send(chat);
    },

    update(req: Request, res: Response) {
        const { inviter } = req.params;
        const { user } = req.session;
        if (req.body.accepted === "true") {
            gameService.create(inviter, user.username);
        }
        gameInvitationStore.destroy(inviter, user);
        res.sendStatus(200);
    },

    create(req: Request, res: Response) {
        const { chatId } = req.params;
        const invitee = req.body.invitee;
        gameInvitationStore.create(chatId, invitee);
        res.sendStatus(200);
    },
};
