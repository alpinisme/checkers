import { Game, isGame } from "../models/game";
import { assertType, parseJson } from "../utils";
import redis from "./redis";

function assignToPlayer(username: string, gameId: string) {
    redis.zadd(username + ":games", Date.now(), gameId);
}

function create(game: Game) {
    const gameId = `${game.black}:${game.red}:${Date.now()}`;
    redis.set("game:" + gameId, JSON.stringify(game));
    assignToPlayer(game.black, gameId);
    assignToPlayer(game.red, gameId);
    return gameId;
}

async function get(gameId: string): Promise<Game> {
    const json = await redis.get("game:" + gameId);
    const game = await parseJson(json);
    return assertType(game, isGame);
}

function update(username: string, gameId: string, game: Game) {
    // reassign to player so that the newly played game is first in player's sorted set
    assignToPlayer(username, gameId);
    redis.set("game:" + gameId, JSON.stringify(game));
}

function allIdsBelongingTo(username: string) {
    return redis.zrange(username + ":games", 0, -1, "WITHSCORES");
}

export default {
    create,
    get,
    update,
    allIdsBelongingTo,
};
