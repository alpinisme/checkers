import { Board, Color, isBoard, makeNewBoard } from "./board";

/* type declarations */

export interface Game {
    board: Board;
    black: string;
    red: string;
    activeColor: Color;
}

/**
 * Initializes model of new game
 * @param black username of black player
 * @param red username of red player
 * @returns a new game
 */
export function makeNewGame(black: string, red: string): Game {
    return {
        activeColor: Color.Black,
        board: makeNewBoard(),
        black,
        red,
    };
}

export function isGame(game: any): game is Game {
    const colors = [Color.Black, Color.Red];
    if (!colors.includes(game?.activeColor)) {
        return false;
    }
    if (!game.black || !game.red) {
        return false;
    }
    return isBoard(game.board);
}
