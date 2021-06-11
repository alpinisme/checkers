import gameInvitationStore from "../../../src/store/gameInvitationStore";
import redis from "../../../src/store/redis";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Game invitation store", () => {
    test("General invitations can be created and then retrieved without knowing any associated id", async () => {
        const inviter = "Mahmud";
        gameInvitationStore.createPublicInvite(inviter);
        expect(await gameInvitationStore.getPublicInvites()).toContain(inviter);
    });

    test("Users should be capable of being invited to join game", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        gameInvitationStore.create(inviter, invitee);
        expect(await gameInvitationStore.all(invitee)).toContain(inviter);
    });

    test("An invitation can be deleted", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        gameInvitationStore.create(inviter, invitee);
        gameInvitationStore.destroy(inviter, invitee);
        expect(await gameInvitationStore.all(invitee)).toEqual([]);
    });

    test("An invitation is not retrieved if it does not belong to invitee", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        const interloper = "Ishmael";
        gameInvitationStore.create(inviter, invitee);
        expect(await gameInvitationStore.all(interloper)).toEqual([]);
    });
});
