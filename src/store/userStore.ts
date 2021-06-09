import redis from "./redis";
import bcrypt from "bcrypt";
import { assertType, hasKeys } from "../utils";
import ValidationError from "../errors/ValidationError";

export interface User {
    username: string;
    wins: number;
    losses: number;
}

function getKey(username: string) {
    return "user:" + username;
}

function isUser(user: any): user is User {
    return hasKeys(user, ["username", "wins", "losses"]);
}

async function create(username: string, password: string): Promise<void> {
    const existingUser = await redis.hget("user:" + username, "password");
    if (existingUser) {
        throw new ValidationError("username", "Username already taken");
    }
    const key = getKey(username);
    const encrypted = await bcrypt.hash(password, 10);
    redis.hset(key, "wins", 0);
    redis.hset(key, "losses", 0);
    redis.hset("user:" + username, "password", encrypted);
}

async function get(username: string): Promise<User> {
    const key = getKey(username);
    const data = await redis.hgetall(key);
    const user = {
        username: username,
        wins: Number(data.wins),
        losses: Number(data.losses),
    };
    return assertType(user, isUser);
}

function recordWin(username: string) {
    const key = getKey(username);
    redis.hincrby(key, "wins", 1);
}

function recordLoss(username: string) {
    const key = getKey(username);
    redis.hincrby(key, "losses", 1);
}

async function checkPassword(username: string, password: string) {
    const key = getKey(username);
    const storedPassword = await redis.hget(key, "password");
    if (!storedPassword) throw new Error();
    return storedPassword ? bcrypt.compare(password, storedPassword) : false;
}

export default {
    get,
    create,
    recordLoss,
    recordWin,
    checkPassword,
};
