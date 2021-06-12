import { Request, Response } from "express";
import chatInvitationStore from "../store/chatInvitationStore";
import chatStore from "../store/chatStore";

export default {
    async index(req: Request, res: Response) {
        const { chatInvitationId } = req.params;
        const chat = await chatInvitationStore.all(chatInvitationId);
        res.send(chat);
    },

    update(req: Request, res: Response) {
        const { chatId } = req.params;
        const { user } = req.session;
        const accepted: string = req.body.accepted;
        if (accepted) {
            chatStore.addToRoom(chatId, user.username);
        }
        chatInvitationStore.destroy(chatId, user);
        res.sendStatus(200);
    },

    create(req: Request, res: Response) {
        const { chatId } = req.params;
        const invitee = req.body.invitee;
        chatInvitationStore.create(chatId, invitee);
    },
};
