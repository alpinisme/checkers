import { makeNewGame } from "../../../src/models/game";
import gameService from "../../../src/services/gameService";
import gameStore from "../../../src/store/gameStore";
import redis from "../../../src/store/redis";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Game store", () => {
    test("Creating a new game yields a properly formated gameId", async () => {
        const player1 = "alpha";
        const player2 = "omega";
        const gameIdPrefix = player1 + ":" + player2;
        const id = gameStore.create(makeNewGame(player1, player2));
        expect(id.startsWith(gameIdPrefix)).toBe(true);
    });

    // test("Updating a game should increase its score in the set of all the player's games (and only that player's)", async () => {
    //     const player1 = "alpha";
    //     const player2 = "omega";
    //     const game = makeNewGame(player1, player2);
    //     gameStore.create(game);
    //     const initial = await gameStore.allIdsBelongingTo(player1);
    //     await new Promise((resolve) => setTimeout(() => resolve(true), 2));
    //     gameStore.update(player1, initial[0], game);
    //     const final = await gameStore.allIdsBelongingTo(player1);
    //     const player2Initial = await gameStore.allIdsBelongingTo(player2);
    //     const player2Final = await gameStore.allIdsBelongingTo(player2);

    //     expect(Number(initial[1])).toBeLessThan(Number(final[1]));
    //     expect(Number(player2Initial[1])).not.toBeLessThan(
    //         Number(player2Final[1])
    //     );
    // });

    test("All game ids belonging to a user can be retrieved", async () => {
        const player1 = "alpha";
        const player2 = "omega";
        const game = makeNewGame(player1, player2);
        const gameId = gameStore.create(game);
        gameStore.assignToPlayer(gameId, player1);
        const ids = await gameStore.allIdsBelongingTo(player1);
        expect(ids[0]).toEqual(gameId);
        expect(await gameStore.get(ids[0])).toEqual(game);
    });

    test("A game can be stored and retrieved", async () => {
        expect.assertions(1);
        const player1 = "alpha";
        const player2 = "omega";
        const game = makeNewGame(player1, player2);
        const gameId = gameStore.create(game);
        expect(await gameStore.get(gameId)).toEqual(game);
    });

    test("A non-game stored as a game should throw an error when retrieved", async () => {
        expect.assertions(1);
        const game: any = {};
        const gameId = gameStore.create(game);
        await expect(gameStore.get(gameId)).rejects.toThrow();
    });

    test("A user's ownership of a game can be verified", async () => {
        const player1 = "alpha";
        const player2 = "omega";
        const game = makeNewGame(player1, player2);
        const gameId = gameStore.create(game);
        gameStore.assignToPlayer(gameId, player1);
        const hasPlayer = await gameStore.hasPlayer(gameId, player1);
        expect(hasPlayer).toEqual(true);
    });
});
