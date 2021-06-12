import { Game, isGame } from "../models/game";
import { assertType, parseJson } from "../utils";
import redis from "./redis";

function makeGameKey(postfix: string) {
    return "game:" + postfix;
}

function makeOwnershipKey(prefix: string) {
    return prefix + ":games";
}

export default {
    create(game: Game) {
        const gameId = `${game.black}:${game.red}:${Date.now()}`;
        redis.set(makeGameKey(gameId), JSON.stringify(game));
        return gameId;
    },

    async get(gameId: string): Promise<Game> {
        const json = await redis.get(makeGameKey(gameId));
        const game = await parseJson(json);
        return assertType(game, isGame);
    },

    update(gameId: string, game: Game) {
        redis.set(makeGameKey(gameId), JSON.stringify(game));
    },

    assignToPlayer(username: string, gameId: string) {
        return redis.zadd(makeOwnershipKey(username), Date.now(), gameId);
    },

    allIdsBelongingTo(username: string) {
        return redis.zrange(makeOwnershipKey(username), 0, -1); // Add "WITHSCORES" as fourth arg to get timestamps
    },

    async hasPlayer(gameId: string, username: string) {
        const isMember = await redis.zscore(makeOwnershipKey(username), gameId);
        return isMember !== null;
    },
};
