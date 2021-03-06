import supertest from "supertest";
import chatStore from "../../src/store/chatStore";
import gameStore from "../../src/store/gameStore";
import redis from "../../src/store/redis";
import { mockApp, mockAuthUser } from "./authenticatedMockApp";

const request = supertest(mockApp);

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Chat routes", () => {
    test("An authenticated user can add a message to a general chat room that they belong to", async () => {
        const username = mockAuthUser.username;
        const chatId = "inviter:819283";
        chatStore.addToRoom(chatId, username);
        const response = await request
            .put("/chat/" + chatId)
            .send({ message: "Howdy!", timestamp: Date.now() });

        expect(response.statusCode).toBe(200);
    });

    test("An authenticated user cannot add a message to a general chat room that they do not belong to", async () => {
        const chatId = "inviter:819283";
        const response = await request
            .put("/chat/" + chatId)
            .send({ message: "Howdy!", timestamp: Date.now() });

        expect(response.statusCode).toBe(401);
    });

    test("An authenticated user can retrieve a list of all chat rooms they belong to", async () => {
        const username = mockAuthUser.username;
        const chatIds = [
            "inviter:819283",
            "blahblah:127862375841",
            "ejifowe:23841234",
        ];
        chatIds.forEach((id) => chatStore.addToRoom(id, username));
        const response = await request.get("/chat/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(chatIds);
    });

    test("An authenticated user can add a message to the chat of a game that they belong to", async () => {
        const username = mockAuthUser.username;
        const gameId = "inviter:819283";
        gameStore.assignToPlayer(gameId, username);
        const response = await request
            .put("/chat/" + gameId)
            .send({ message: "Howdy!", timestamp: Date.now() });
        expect(response.statusCode).toBe(200);
    });

    test("An authenticated user cannot add a message to the chat of a game that they don't belong to", async () => {
        const username = mockAuthUser.username;
        const gameId = "inviter:819283";
        const response = await request
            .put("/chat/" + gameId)
            .send({ message: "Howdy!", timestamp: Date.now() });
        expect(response.statusCode).toBe(401);
    });

    test("An authenticated user can view all messages in a chat room they belong to in reverse chronological order", async () => {
        const username = mockAuthUser.username;
        const gameId = "inviter:819283";
        gameStore.assignToPlayer(gameId, username);
        const msg1 = { username, message: "Howdy!", timestamp: Date.now() };
        const msg2 = { ...msg1, message: "Right back at ya!" };
        chatStore.addMessage(gameId, msg1);
        chatStore.addMessage(gameId, msg2);
        const response = await request.get("/chat/" + gameId);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([msg2, msg1]);
    });
});
