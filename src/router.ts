import { Router } from "express";
import userStore from "./store/userStore";
import { validateLogin } from "./validations";

const router = Router();

router.post("/login", validateLogin, async (req, res) => {
    const { username, password } = req.body;
    const authenticated = await userStore.checkPassword(username, password);
    if (!authenticated) {
        res.status(401).end();
    }
    req.session.user = await userStore.get(username);
    res.status(204).end();
});

export default router;
