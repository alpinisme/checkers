import { Board, Color, isBoard, makeNewBoard } from "./board";

/* type declarations */

export interface Game {
    board: Board;
    black: string;
    red: string;
    activeColor: Color;
}

export function makeNewGame(player1: string, player2: string): Game {
    return {
        activeColor: Color.Black,
        board: makeNewBoard(),
        black: player1,
        red: player2,
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
