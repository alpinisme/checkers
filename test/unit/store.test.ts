import gameStore from "../../src/store/gameStore";
import userStore from "../../src/store/userStore";
import chatStore, { Message } from "../../src/store/chatStore";
import { Color } from "../../src/models/board";
import redis from "../../src/store/redis";
import { makeNewGame } from "../../src/models/game";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Game store", () => {
    test("A game can be saved and retrieved", async () => {
        const player1 = "alpha";
        const player2 = "omega";
        const gameIdPrefix = player1 + ":" + player2;
        gameStore.create(makeNewGame(player1, player2));
        const ids = await gameStore.allIdsBelongingTo(player1);
        const id = ids[0];
        expect(id.startsWith(gameIdPrefix)).toBe(true);
    });

    test("Updating a game should increase its score in the set of all the player's games (and only that player's)", async () => {
        const player1 = "alpha";
        const player2 = "omega";
        const game = makeNewGame(player1, player2);
        gameStore.create(game);
        const initial = await gameStore.allIdsBelongingTo(player1);
        await new Promise((resolve) => setTimeout(() => resolve(true), 2));
        gameStore.update(player1, initial[0], game);
        const final = await gameStore.allIdsBelongingTo(player1);
        const player2Initial = await gameStore.allIdsBelongingTo(player2);
        const player2Final = await gameStore.allIdsBelongingTo(player2);

        expect(Number(initial[1])).toBeLessThan(Number(final[1]));
        expect(Number(player2Initial[1])).not.toBeLessThan(
            Number(player2Final[1])
        );
    });

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
