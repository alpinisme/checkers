import { Request, Response } from "express";
import ValidationError from "../errors/ValidationError";
import userStore from "../store/userStore";

export default {
    logout(req: Request, res: Response) {
        delete req.session.user;
        res.sendStatus(200);
    },

    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const authenticated = await userStore.checkPassword(username, password);
        if (!authenticated) {
            res.status(401).end();
        }
        req.session.user = await userStore.get(username);
        res.status(204).end();
    },

    async register(req: Request, res: Response) {
        const { username, password } = req.body;
        try {
            await userStore.create(username, password);
            req.session.user = await userStore.get(username);
            res.status(204).end();
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send({ errors: { [error.field]: error.rule } });
            } else {
                throw error;
            }
        }
    },
};
