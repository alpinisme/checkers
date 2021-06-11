import redis from "./redis";

function makeKey(postfix: string) {
    return "game-invite: " + postfix;
}

const publicKey = "public-game-invite";

export default {
    async create(inviter: string, invitee: string) {
        redis.sadd(makeKey(invitee), inviter);
    },

    async destroy(inviter: string, invitee: string) {
        redis.srem(makeKey(invitee), inviter);
    },

    async all(username: string) {
        return redis.smembers(makeKey(username));
    },

    async createPublicInvite(inviter: string) {
        redis.sadd(publicKey, inviter);
    },

    async getPublicInvites(count = 10) {
        return redis.srandmember(publicKey, count);
    },
};
