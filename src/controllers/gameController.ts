import { Request, Response } from "express";
import { play } from "../models/play";
import gameStore from "../store/gameStore";
import { User } from "../models/user";
import { GameError } from "../errors/GameError";
import gameService from "../services/gameService";

export default {
    async show(req: Request, res: Response) {
        const { gameId } = req.params;
        try {
            const game = await gameStore.get(gameId);
            res.send(game);
        } catch (error) {
            res.sendStatus(404);
        }
    },

    async update(req: Request, res: Response) {
        const gameId = req.params.gameId;

        const user = req.session.user as User; // requireAuth middleware guarantees this cast
        try {
            const game = await gameStore.get(gameId);
            const result = play(game, req.body);
            gameStore.update(user.username, gameId, result);
            res.sendStatus(200);
        } catch (err) {
            if (err instanceof GameError) {
                res.status(400).send({ errors: { message: err.message } });
            } else {
                res.sendStatus(404); // check if notfounderror (create that)
            }
        }
    },

    async create(req: Request, res: Response) {
        const invitationId = req.body.invitationId;
        const black = req.body.black;
        const red = req.body.red;
        gameService.create(black, red);
        res.sendStatus(200);
    },
};
