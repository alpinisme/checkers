import supertest from "supertest";
import chatStore from "../../src/store/chatStore";
import redis from "../../src/store/redis";
import { mockApp, mockAuthUser } from "./authenticatedMockApp";

const request = supertest(mockApp);

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Chat routes", () => {
    test("An authenticated user can add a message to a general chat room that they belong to", async () => {
        const username = mockAuthUser.username;
        const chatId = "inviter:819283";
        chatStore.addUser(chatId, username);
        const response = await request
            .put("/chat/" + chatId)
            .send({ message: "Howdy!", timetamp: Date.now() });

        expect(response.statusCode).toBe(200);
    });

    test("An authenticated user cannot add a message to a general chat room that they do not belong to", async () => {
        const chatId = "inviter:819283";
        const response = await request
            .put("/chat/" + chatId)
            .send({ message: "Howdy!", timeStamp: Date.now() });

        expect(response.statusCode).toBe(401);
    });

    test("An authenticated user can retrieve a list of all chat rooms they belong to", async () => {
        const username = mockAuthUser.username;
        const chatIds = [
            "inviter:819283",
            "blahblah:127862375841",
            "ejifowe:23841234",
        ];
        chatIds.forEach((id) => chatStore.addUser(id, username)); // TODO: rename addUser to addToRoom
        const response = await request.get("/chat/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(chatIds);
    });
});
