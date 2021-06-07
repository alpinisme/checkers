import { Board, Color, Position } from "./board";
import { takeTurn } from "./move";
import equal from "deep-equal";

/* type declarations */

export interface Game {
    turn: Color;
    board: Board;
}

export interface TurnRequest {
    color: Color;
    board: Board;
    turn: Position[];
}

/* error class */

class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GameError";
    }
}

/* helper functions */

function isOffBoard(position: Position) {
    const y = position[0];
    const x = position[1];
    // board is 8 x 8, with 0-indexed positions
    return y < 0 || y > 7 || x < 0 || x > 7;
}

function hasOffBoardMoves(turn: Position[]) {
    return turn.some(isOffBoard);
}

function isGameOver(board: Board) {
    return (
        board.every((piece) => piece.color == Color.Black) ||
        board.every((piece) => piece.color == Color.Red)
    );
}

/* core module export */

export function play(game: Game, request: TurnRequest) {
    if (!equal(game.board, request.board)) {
        throw new GameError("Mismatched Boards");
    }
    if (isGameOver(request.board)) {
        throw new GameError("Game Over");
    }
    if (game.turn != request.color) {
        throw new GameError("Not Player's Turn");
    }
    if (hasOffBoardMoves(request.turn)) {
        throw new GameError("Offboard Move");
    }

    return takeTurn(request.board, request.turn);
}
