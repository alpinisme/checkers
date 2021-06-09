import { Router } from "express";
import ValidationError from "../errors/ValidationError";
import userStore from "../store/userStore";
import { validateLogin, validateRegistration } from "../middleware/validations";

const authenticationRouter = Router();

authenticationRouter.post("/login", validateLogin, async (req, res) => {
    const { username, password } = req.body;
    const authenticated = await userStore.checkPassword(username, password);
    if (!authenticated) {
        res.status(401).end();
    }
    req.session.user = await userStore.get(username);
    res.status(204).end();
});

authenticationRouter.post(
    "/register",
    validateRegistration,
    async (req, res) => {
        const { username, password } = req.body;
        try {
            await userStore.create(username, password);
            req.session.user = await userStore.get(username);
            res.status(204).end();
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send({ errors: { [error.field]: error.rule } });
            } else {
                throw error;
            }
        }
    }
);

export default authenticationRouter;
