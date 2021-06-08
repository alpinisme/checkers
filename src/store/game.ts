import { Game } from "../models/game";
import { parseJson } from "../utils";
import redis from "./redis";

function isGame(game: any): game is Game {
    if (game?.turn != undefined) return false;
    if (game?.board?.length <= 0) return false;
    return true;
}

function assertIsGame(game: unknown): Game {
    if (!isGame(game))
        throw new Error("Expected game but received something else");
    return game;
}

function assignToPlayer(username: string, gameId: string) {
    redis.zadd(username + ":games", Date.now(), gameId);
}

function create(player1: string, player2: string, game: Game) {
    const gameId = `game:${player1}:${player2}:${Date.now()}`;
    redis.set(gameId, JSON.stringify(game));
    assignToPlayer(player1, gameId);
    assignToPlayer(player2, gameId);
}

async function get(gameId: string): Promise<Game> {
    const json = await redis.get("game:" + gameId);
    const game = await parseJson(json);
    return assertIsGame(game);
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
