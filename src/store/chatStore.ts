import { isMessage, Message } from "../models/chat";
import { assertType, parseJson } from "../utils";
import redis from "./redis";

function makeRoomKey(postfix: string) {
    return "chat:" + postfix;
}

function makeMembershipKey(postfix: string) {
    return "chats:" + postfix;
}

async function addMessage(id: string, message: Message) {
    const key = makeRoomKey(id);
    const count = await redis.lpush(key, JSON.stringify(message));
    if (count > 50) {
        redis.ltrim(key, 0, 49);
    }
}

async function getChat(id: string): Promise<Message[]> {
    const key = makeRoomKey(id);
    const unparsed = await redis.lrange(key, 0, -1);
    const parsed = unparsed
        .map(parseJson)
        .map((msg) => assertType(msg, isMessage));
    return parsed;
}

function addUser(chatId: string, username: string) {
    redis.sadd(makeMembershipKey(username), chatId);
}

async function isInRoom(chatId: string, username: string) {
    return (await redis.sismember(makeMembershipKey(username), chatId)) == 1
        ? true
        : false;
}

export default {
    addMessage,
    getChat,
    addUser,
    isInRoom,
};
