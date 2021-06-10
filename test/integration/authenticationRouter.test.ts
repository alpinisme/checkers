import supertest from "supertest";
import app from "../../src/app";
import redis from "../../src/store/redis";
import userStore from "../../src/store/userStore";

const request = supertest(app);

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Login route", () => {
    test("A user can log in with proper credentials", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        await userStore.create(username, password);
        const response = await request
            .post("/login")
            .send({ username, password });
        expect(response.status).toBe(204);
    });

    test("A user cannot log in with improper credentials", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        await userStore.create(username, "oops");
        const response = await request
            .post("/login")
            .send({ username, password });
        expect(response.status).toBe(401);
    });
});

describe("Registration route", () => {
    test("A user can register with new username and matching password", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        const verifyPassword = password;
        const response = await request
            .post("/register")
            .send({ username, password, verifyPassword });
        expect(response.status).toBe(204);
    });

    test("A user must have a unique username to register", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        const verifyPassword = password;
        await userStore.create(username, "oops");
        const response = await request
            .post("/register")
            .send({ username, password, verifyPassword });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual({
            username: "Username already taken",
        });
    });

    test("A user must supply matching verify-password to register", async () => {
        const username = "SomeDude";
        const password = "passw0rd";
        const verifyPassword = password + "typo";
        const response = await request
            .post("/register")
            .send({ username, password, verifyPassword });
        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual({
            verifyPassword: "Passwords do not match",
        });
    });
});
