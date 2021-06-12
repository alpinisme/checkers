import { Request, Response } from "express";
import { Message } from "../models/chat";
import chatStore from "../store/chatStore";

export default {
    async index(req: Request, res: Response) {
        const username = req.session.user.username;
        const chat = await chatStore.index(username);
        res.send(chat);
    },

    update(req: Request, res: Response) {
        const { chatId } = req.params;
        const message: Message = req.body;
        chatStore.addMessage(chatId, message);
        res.sendStatus(200);
    },

    async show(req: Request, res: Response) {
        const { chatId } = req.params;
        try {
            const chat = await chatStore.getChat(chatId);
            res.send(chat);
        } catch {
            res.sendStatus(404);
        }
    },
};
