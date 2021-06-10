import redis from "./redis";
import bcrypt from "bcrypt";
import { assertType } from "../utils";
import ValidationError from "../errors/ValidationError";
import { isUser, User } from "../models/user";

function getKey(username: string) {
    return "user:" + username;
}

export default {
    async create(username: string, password: string): Promise<void> {
        const existingUser = await redis.hget("user:" + username, "password");
        if (existingUser) {
            throw new ValidationError("username", "Username already taken");
        }
        const key = getKey(username);
        const encrypted = await bcrypt.hash(password, 10);
        redis.hset(key, "wins", 0);
        redis.hset(key, "losses", 0);
        redis.hset("user:" + username, "password", encrypted);
    },

    async get(username: string): Promise<User> {
        const key = getKey(username);
        const data = await redis.hgetall(key);
        const user = {
            username: username,
            wins: Number(data.wins),
            losses: Number(data.losses),
        };
        return assertType(user, isUser);
    },

    /**
     * Increments the user's win count
     * @param username
     */
    recordWin(username: string) {
        const key = getKey(username);
        redis.hincrby(key, "wins", 1);
    },

    /**
     * Increments the user's loss count
     * @param username
     */
    recordLoss(username: string) {
        const key = getKey(username);
        redis.hincrby(key, "losses", 1);
    },

    async checkPassword(username: string, password: string) {
        const key = getKey(username);
        const storedPassword = await redis.hget(key, "password");
        if (!storedPassword) throw new Error();
        return storedPassword
            ? bcrypt.compare(password, storedPassword)
            : false;
    },
};
