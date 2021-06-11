import redis from "./redis";

function makeKey(postfix: string) {
    return "chat-invite: " + postfix;
}

export default {
    async create(inviter: string, invitee: string) {
        redis.sadd(makeKey(invitee), inviter);
    },

    async destroy(inviter: string, invitee: string) {
        redis.srem(makeKey(invitee), inviter);
    },

    async all(username: string) {
        redis.smembers(makeKey(username));
    },
};
