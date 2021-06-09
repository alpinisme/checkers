import { config } from "dotenv";

config();

export interface SessionConfig {
    secret: string;
    resave: boolean;
    saveUninitialized: boolean;
    cookie: { secure: boolean } | {};
}

export default {
    session: {
        secret: process.env.SECRET || "Hey there, whatcha lookin at?",
        resave: false,
        saveUninitialized: false,
        cookie: process.env.NODE_ENV == "production" ? { secure: true } : {},
    },
};
