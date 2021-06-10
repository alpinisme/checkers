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
    test("A user can view a game of their own", async () => {
        const username = mockAuthUser.username;
        const otherUser = "Jacob";
        const game = makeNewGame(username, otherUser);
        gameStore.create(game);
        const gameId = (await gameStore.allIdsBelongingTo(username))[0];
        const response = await request.get("/game/" + gameId);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(game);
    });

    test("A user cannot view someone else's game", async () => {
        const username = "SomeDude";
        const otherUser = "Jacob";
        const game = makeNewGame(username, otherUser);
        const gameId = gameStore.create(game);
        // const gameId = (await gameStore.allIdsBelongingTo(username))[0];
        const response = await request.get("/game/" + gameId);
        expect(response.status).toBe(401);
    });
});

describe("Turn taking", () => {
    test("A user should be able to take a turn in their game", async () => {
        const username = mockAuthUser.username;
        const otherUser = "Jacob";
        const game = makeNewGame(username, otherUser);
        const gameId = gameStore.create(game);
        const turn = [
            [2, 1],
            [3, 2],
        ];
        const response = await request
            .put("/game/" + gameId)
            .send({ ...game, turn });
        expect(response.status).toBe(200);
    });
});
