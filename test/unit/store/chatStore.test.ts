import { Message } from "../../../src/models/chat";
import chatStore from "../../../src/store/chatStore";
import redis from "../../../src/store/redis";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Chat store", () => {
    test("Messages can be added and retrieved from a game's chat room", async () => {
        expect.assertions(1);
        const gameId = "example:game";
        const msg: Message = {
            username: "User",
            message: "Hello World",
            timestamp: Date.now(),
        };
        await chatStore.addMessage(gameId, msg);
        await expect(chatStore.getChat(gameId)).resolves.toEqual([msg]);
    });

    test("Messages are retrieved from a game's chat room in reverse chronological order", async () => {
        expect.assertions(1);
        const gameId = "example:game";
        const msg1: Message = {
            username: "User",
            message: "Hello World",
            timestamp: Date.now(),
        };
        const msg2: Message = {
            username: "World",
            message: "And hello to you, too",
            timestamp: Date.now(),
        };
        await chatStore.addMessage(gameId, msg1);
        await chatStore.addMessage(gameId, msg2);
        await expect(chatStore.getChat(gameId)).resolves.toEqual([msg2, msg1]);
    });

    test("A user can be verified to belong to a general (not game-specific) chat room", async () => {
        const chatId = "blah";
        const username = "Idk";
        chatStore.addToRoom(chatId, username);
        expect(await chatStore.isInRoom(chatId, username)).toBe(true);
    });
});
