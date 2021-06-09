import config from "config";
import express from "express";
import session from "express-session";
import store from "connect-redis";
import redis from "./store/redis";
import router from "./routes";
import { SessionConfig } from "../config/default";

const RedisStore = store(session);

const app = express();

const sessionConfig = {
    ...config.get<SessionConfig>("session"),
    store: new RedisStore({ client: redis }),
};

app.use(session(sessionConfig));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(router);

export default app;
