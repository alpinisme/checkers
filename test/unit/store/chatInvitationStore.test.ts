import chatInvitationStore from "../../../src/store/chatInvitationStore";
import redis from "../../../src/store/redis";

jest.mock("ioredis", () => require("ioredis-mock/jest"));

beforeEach(() => redis.flushdb());

describe("Chat invitation store", () => {
    test("Users should be capable of being invited to join chat", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        chatInvitationStore.create(inviter, invitee);
        expect(await chatInvitationStore.all(invitee)).toContain(inviter);
    });

    test("An invitation can be deleted", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        chatInvitationStore.create(inviter, invitee);
        chatInvitationStore.destroy(inviter, invitee);
        expect(await chatInvitationStore.all(invitee)).toEqual([]);
    });

    test("An invitation is not retrieved if it does not belong to invitee", async () => {
        const inviter = "Mahmud";
        const invitee = "Mohammed";
        const interloper = "Ishmael";
        chatInvitationStore.create(inviter, invitee);
        expect(await chatInvitationStore.all(interloper)).toEqual([]);
    });
});
