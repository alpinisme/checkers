import app from "../../src/server";
import express from "express";
import session from "express-session";
import { User } from "../../src/store/userStore";

const mockAuthUser: User = {
    username: "Joe Shmo",
    losses: 0,
    wins: 42,
};

const mockApp = express();

mockApp.use(
    session({ secret: "hey", resave: false, saveUninitialized: false })
);

mockApp.all("*", function (req, res, next) {
    req.session.user = mockAuthUser;
    next();
});

mockApp.use(app);

export { mockApp, mockAuthUser };
