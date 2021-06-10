import userStore from "../../../src/store/userStore";
import chatStore from "../../../src/store/chatStore";
import redis from "../../../src/store/redis";
import { Message } from "../../../src/models/chat";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("User store", () => {
    test("Password check works", async () => {
        const username = "Example";
        const password = "Pass1234";
        await userStore.create(username, password);
        const rightPassWorks = userStore.checkPassword(username, password);
        await expect(rightPassWorks).resolves.toBe(true);
        const wrongPassWorks = userStore.checkPassword(username, "wrongpass");
        await expect(wrongPassWorks).resolves.toBe(false);
    });

    test("A username can be multiple words with special characters", async () => {
        const username = "Example - Crazy; &Pass";
        const password = "Pass1234";
        await userStore.create(username, password);
        await expect(userStore.checkPassword(username, password)).resolves.toBe(
            true
        );
    });

    test("Wins and losses can be recorded for a user", async () => {
        const username = "Example";
        const password = "Pass1234";

        userStore.create(username, password);
        userStore.recordLoss(username);
        userStore.recordWin(username);
        userStore.recordWin(username);
        const user = await userStore.get(username);
        expect(user.wins).toBe(2);
        expect(user.losses).toBe(1);
    });
});

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
});
