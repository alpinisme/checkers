import { Request, Response } from "express";
import { GameError, play } from "../models/game";
import gameStore from "../store/gameStore";
import { User } from "../store/userStore";

async function show(req: Request, res: Response) {
    const { gameId } = req.params;
    try {
        const game = await gameStore.get(gameId);
        res.send(game);
    } catch (error) {
        res.sendStatus(404);
    }
}

async function update(req: Request, res: Response) {
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
}

export default {
    show,
    update,
};
