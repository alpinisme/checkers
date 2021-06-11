import { Request, Response } from "express";
import { TurnRequest } from "../models/play";
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
            console.log(error);
            res.sendStatus(404);
        }
    },

    async update(req: Request, res: Response) {
        const gameId = req.params.gameId;
        const user: User = req.session.user;
        const request: TurnRequest = req.body;

        try {
            gameService.update(user.username, gameId, request);
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
