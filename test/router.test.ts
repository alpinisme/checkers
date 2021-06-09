import supertest from "supertest";
import app from "../src/server";
import redis from "../src/store/redis";
import userStore from "../src/store/userStore";

const request = supertest(app);

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Login route", () => {
    test("A user can log in with proper credentials", async () => {
        const username = "SomeDude"; // TODO: validate for multi-word usernames
        const password = "passw0rd";
        await userStore.create(username, password);
        const response = await request
            .post("/login")
            .send({ username, password });
        expect(response.status).toBe(204);
    });

    test("A user cannot log in with improper credentials", async () => {
        const username = "SomeDude"; // TODO: validate for multi-word usernames
        const password = "passw0rd";
        await userStore.create(username, "oops");
        const response = await request
            .post("/login")
            .send({ username, password });
        expect(response.status).toBe(401);
    });
});
