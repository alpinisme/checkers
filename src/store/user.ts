import redis from "./redis";
import bcrypt from "bcrypt";
import { assertType, hasKeys } from "../utils";

export interface User {
    username: string;
    password: string;
    wins: number;
    losses: number;
}

function getKey(username: string) {
    return "user:" + username;
}

function isUser(user: any): user is User {
    return hasKeys(user, ["username", "password", "wins", "losses"]);
}

async function create(username: string, password: string): Promise<void> {
    const existingUser = await redis.get("user:" + username);
    if (existingUser) {
        throw new Error("Username already taken");
    }
    const key = getKey(username);
    const encrypted = await bcrypt.hash(password, 10);
    redis.hset(key, "wins", 0);
    redis.hset(key, "losses", 0);
    redis.hset("user:" + username, "password", encrypted);
}

async function get(username: string): Promise<User> {
    const key = getKey(username);
    const user = await redis.hgetall(username);
    user.username = username;
    return assertType(user, isUser);
}

function recordWin(username: string) {
    const key = getKey(username);
    redis.hincrby(key, "wins", 1);
}

function recordLoss(username: string) {
    const key = getKey(username);
    redis.hincrby(key, "lossses", 1);
}

export default {
    get,
    create,
    recordLoss,
    recordWin,
};
