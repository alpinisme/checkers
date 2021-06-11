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
            .send({ message: "Howdy!" });

        expect(response.statusCode).toBe(200);
    });
});
