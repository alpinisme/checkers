import { NextFunction, Request, Response } from "express";

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
    }
    next();
}
