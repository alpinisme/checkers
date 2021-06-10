import { makeNewGame } from "../../../src/models/game";
import gameStore from "../../../src/store/gameStore";
import redis from "../../../src/store/redis";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Game store", () => {
    test("A game can be saved and retrieved", async () => {
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

    test("A non-game stored as a game should throw an error when retrieved", async () => {
        expect.assertions(1);
        const player1 = "alpha";
        const player2 = "omega";
        const game: any = {};
        gameStore.create(game);
        const ids = await gameStore.allIdsBelongingTo(player1);

        await expect(gameStore.get("game:" + ids[0])).rejects.toThrowError(
            "Failed to parse non-string as json"
        );
    });
});
