import { NextFunction, Request, Response } from "express";
import gameStore from "../store/gameStore";

export default async function requireGameOwnership(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const gameId = req.params.gameId;
    const username = req.session.user?.username;
    const isPlayer = await gameStore.hasPlayer(gameId, username);

    if (!isPlayer) {
        res.sendStatus(401);
    } else {
        next();
    }
}
