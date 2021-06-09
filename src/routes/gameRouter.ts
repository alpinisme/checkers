import { Router } from "express";
import requireAuth from "../middleware/requireAuth";
import requireGameOwnership from "../middleware/requireGameOwnership";
import gameStore from "../store/gameStore";

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
            res.status(404).end();
        }
    }
);

export default gameRouter;
