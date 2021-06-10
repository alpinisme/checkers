import { NextFunction, Request, Response } from "express";

export default function requireGameOwnership(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const gameId: string | undefined = req.params.gameId || req.body.gameId;
    const username = req.session.user?.username;

    if (!gameId) {
        throw new Error("requireGameOwnership middleware requires gameId");
    }
    if (!username) {
        throw new Error(
            "requireGameOwnership middleware requires authenticated user"
        );
    }

    const ownerIds = gameId.split(":");
    if (!ownerIds.includes(username)) {
        res.status(401).end();
    } else {
        next();
    }
}
