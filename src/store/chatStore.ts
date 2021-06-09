import { assertType, hasKeys, parseJson } from "../utils";
import redis from "./redis";

export interface Message {
    username: string;
    message: string;
    timestamp: number;
}

function isMessage(msg: any): msg is Message {
    return hasKeys(msg, ["username", "message", "timestamp"]);
}

async function addMessage(gameId: string, message: Message) {
    const chatId = "chat:" + gameId;
    const count = await redis.lpush(chatId, JSON.stringify(message));
    if (count > 50) {
        redis.ltrim(chatId, 0, 49);
    }
}

async function getChat(gameId: string): Promise<Message[]> {
    const chatId = "chat:" + gameId;
    const unparsed = await redis.lrange(chatId, 0, -1);
    const parsed = unparsed
        .map(parseJson)
        .map((msg) => assertType(msg, isMessage));
    return parsed;
}

export default {
    addMessage,
    getChat,
};
