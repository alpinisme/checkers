import { makeNewGame } from "../models/game";
import { play, TurnRequest } from "../models/play";
import gameStore from "../store/gameStore";

export default {
    create(black: string, red: string) {
        const gameData = makeNewGame(black, red);
        const gameId = gameStore.create(gameData);
        gameStore.assignToPlayer(gameId, black);
        gameStore.assignToPlayer(gameId, red);
    },

    async update(username: string, gameId: string, request: TurnRequest) {
        const game = await gameStore.get(gameId);
        const result = play(game, request);
        gameStore.update(gameId, result);
        gameStore.assignToPlayer(gameId, username); // to update player's list of recently played games
    },
};
