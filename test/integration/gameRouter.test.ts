import supertest from "supertest";
import { makeNewGame } from "../../src/models/game";
import gameStore from "../../src/store/gameStore";
import redis from "../../src/store/redis";
import userStore from "../../src/store/userStore";
import { mockApp, mockAuthUser } from "./authenticatedMockApp";

const request = supertest(mockApp);

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Game fetching", () => {
    test("A user can log in with proper credentials", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        await userStore.create(username, password);
        const response = await request
            .post("/login")
            .send({ username, password });
        expect(response.status).toBe(204);
    });

    test("A user can view a game of their own", async () => {
        const username = mockAuthUser.username;
        const otherUser = "Jacob";
        const game = makeNewGame();
        gameStore.create(username, otherUser, game);
        const gameId = (await gameStore.allIdsBelongingTo(username))[0];
        const response = await request.get("/game/" + gameId);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(game);
    });

    test("A user cannot view someone else's game", async () => {
        const username = "SomeDude";
        const otherUser = "Jacob";
        const game = makeNewGame();
        gameStore.create(username, otherUser, game);
        const gameId = (await gameStore.allIdsBelongingTo(username))[0];
        const response = await request.get("/game/" + gameId);
        expect(response.status).toBe(401);
    });
});
