import { makeNewGame } from "../models/game";
import { play, TurnRequest } from "../models/play";
import gameStore from "../store/gameStore";

export default {
    create(black: string, red: string) {
        const gameData = makeNewGame(black, red);
        const gameId = gameStore.create(gameData);
        gameStore.assignToPlayer(black, gameId);
        gameStore.assignToPlayer(red, gameId);
    },

    async update(username: string, gameId: string, request: TurnRequest) {
        const game = await gameStore.get(gameId);
        const result = play(game, request);
        gameStore.update(gameId, result);
        gameStore.assignToPlayer(username, gameId); // to update player's list of recently played games
    },
};
