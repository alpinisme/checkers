import redis from "./redis";

function makeKey(postfix: string) {
    return "chat-invite: " + postfix;
}

export default {
    async create(chatId: string, username: string) {
        redis.sadd(makeKey(username), chatId);
    },

    async destroy(inviteId: string) {
        redis.srem(inviteId);
    },
};
