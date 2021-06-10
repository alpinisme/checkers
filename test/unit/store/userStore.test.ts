import userStore from "../../../src/store/userStore";
import redis from "../../../src/store/redis";

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
