import { Router } from "express";
import gameController from "../controllers/gameController";
import requireAuth from "../middleware/requireAuth";
import requireGameOwnership from "../middleware/requireGameOwnership";
import { validateGame, validateTurn } from "../middleware/validations";

const gameRouter = Router();

gameRouter.use(requireAuth);
gameRouter.use("/game/:gameId", requireGameOwnership);

gameRouter.get("/game/:gameId", gameController.show);

gameRouter.put(
    "/game/:gameId",
    validateGame,
    validateTurn,
    gameController.update
);

export default gameRouter;
