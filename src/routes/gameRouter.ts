import { Router } from "express";
import requireAuth from "../middleware/requireAuth";
import requireGameOwnership from "../middleware/requireGameOwnership";
import { validateGame, validateTurn } from "../middleware/validations";
import { GameError, play } from "../models/game";
import gameStore from "../store/gameStore";
import { User } from "../store/userStore";

const gameRouter = Router();

gameRouter.get(
    "/game/:gameId",
    requireAuth,
    requireGameOwnership,
    async (req, res) => {
        const { gameId } = req.params;
        try {
            const game = await gameStore.get(gameId);
            res.send(game);
        } catch (error) {
            res.sendStatus(404);
        }
    }
);

gameRouter.post(
    "/game/:gameId",
    requireAuth,
    requireGameOwnership,
    validateGame,
    validateTurn,
    async (req, res) => {
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
);

export default gameRouter;
