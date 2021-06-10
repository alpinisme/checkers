import { NextFunction, Request, Response } from "express";
import { isBoard } from "../models/board";
import { isPlayersTurn } from "../models/game";
import { User } from "../models/user";

type ValidationErrors = Record<string, string>;

function isNonEmpty(obj: Record<string, string>): boolean {
    return Object.keys(obj).length > 0;
}

export function validateLogin(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { password, username } = req.body;
    const errors: ValidationErrors = {};
    if (password == undefined) {
        errors.password = "Password required";
    }
    if (username == undefined) {
        errors.username = "Username required";
    }
    if (isNonEmpty(errors)) {
        res.status(400).send({ errors });
    }
    next();
}

export function validateRegistration(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { password, verifyPassword, username } = req.body;
    const errors: ValidationErrors = {};
    if (password == undefined) {
        errors.password = "Password required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    }
    if (username == undefined) {
        errors.username = "Username required";
    }
    if (password != verifyPassword) {
        errors.verifyPassword = "Passwords do not match";
    }

    if (isNonEmpty(errors)) {
        res.status(400).send({ errors });
    } else {
        next();
    }
}

export function validateUsername(name: string) {
    return name.length > 3 && !name.includes(":");
}

export function validateGame(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!isBoard(req.body.board)) {
        res.status(400).send({
            errors: {
                message: "Invalid or corrupted game data",
                request: req.body,
            },
        });
    } else {
        next();
    }
}

export function validateTurn(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const user = req.session.user as User;
    if (!isPlayersTurn(req.body, user.username)) {
        res.status(400).send({
            errors: {
                message: "Not your turn",
            },
        });
    } else {
        next();
    }
}
