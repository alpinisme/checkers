import { isMessage, Message } from "../models/chat";
import { assertType, parseJson } from "../utils";
import redis from "./redis";

function makeRoomKey(postfix: string) {
    return "chat:" + postfix;
}

function makeMembershipKey(postfix: string) {
    return "chats:" + postfix;
}

export default {
    /**
     * Finds all ids of chat rooms that the specified user belongs to
     * @param username
     */
    async index(username: string) {
        return await redis.smembers(makeMembershipKey(username));
    },

    /**
     * Adds a message to specified chat room (creating the room if it does not exist yet)
     * @param id chat room id
     * @param message Message object
     */
    async addMessage(id: string, message: Message) {
        const key = makeRoomKey(id);
        const count = await redis.lpush(key, JSON.stringify(message));
        if (count > 50) {
            redis.ltrim(key, 0, 49);
        }
    },

    /**
     * Retrieves all messages in the specified chat room
     * @param id chat room id
     */
    async getChat(id: string): Promise<Message[]> {
        const key = makeRoomKey(id);
        const unparsed = await redis.lrange(key, 0, -1);
        const parsed = unparsed
            .map(parseJson)
            .map((msg) => assertType(msg, isMessage));
        return parsed;
    },

    /**
     * Adds chat room to list of chats that the specified user is in
     * @param chatId id of the room
     * @param username
     */
    addToRoom(chatId: string, username: string) {
        redis.sadd(makeMembershipKey(username), chatId);
    },

    async isInRoom(chatId: string, username: string) {
        return (await redis.sismember(makeMembershipKey(username), chatId)) == 1
            ? true
            : false;
    },
};
