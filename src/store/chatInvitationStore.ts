import { exists } from "fs";
import redis from "./redis";

function makeKey(postfix: string) {
    return "chat-invite: " + postfix;
}

export default {
    async create(chatId: string, invitee: string) {
        redis.sadd(makeKey(invitee), chatId);
    },

    async destroy(chatId: string, invitee: string) {
        redis.srem(makeKey(invitee), chatId);
    },

    async all(username: string) {
        return redis.smembers(makeKey(username));
    },

    async exists(chatId: string, invitee: string) {
        return redis.sismember(makeKey(invitee), chatId);
    },
};
