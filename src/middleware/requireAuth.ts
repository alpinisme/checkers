import { NextFunction, Request, Response } from "express";

export default function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session.user) {
        res.sendStatus(401); // TODO: should probably redirect to login instead
    }
    next();
}
