import {
    Board,
    Color,
    getPiece,
    isBoard,
    isOffBoard,
    makeNewBoard,
    Position,
} from "./board";
import { makeMove } from "./move";
import equal from "deep-equal";

/* type declarations */

export interface Game {
    board: Board;
    black: string;
    red: string;
    activeColor: Color;
}

export interface TurnRequest {
    board: Board;
    turn: Position[];
}

/* error class */

export class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GameError";
    }
}

/* helper functions */

function hasOffBoardMoves(turn: Position[]) {
    return turn.some(isOffBoard);
}

function isGameOver(board: Board) {
    return (
        board.every((piece) => piece.color == Color.Black) ||
        board.every((piece) => piece.color == Color.Red)
    );
}

function flipTurnColor(turn: Color) {
    return turn == Color.Red ? Color.Black : Color.Red;
}

/* core module export */

/**
 * @throws {GameError}
 */
export function play(game: Game, request: TurnRequest): Game {
    if (!equal(game.board, request.board)) {
        throw new GameError("Mismatched Boards");
    }
    if (isGameOver(request.board)) {
        throw new GameError("Game Over");
    }
    if (hasOffBoardMoves(request.turn)) {
        throw new GameError("Offboard Move");
    }
    if (getPiece(request.board, request.turn[0])?.color != game.activeColor) {
        throw new GameError("Illegal move: Cannot move opponent's piece");
    }

    const attempt = makeMove(game.activeColor, request);

    if (!attempt.isSuccessful) {
        throw new GameError(attempt.error);
    }

    return {
        ...game,
        board: attempt.result,
        activeColor: flipTurnColor(game.activeColor),
    };
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

export function isPlayersTurn(game: Game, username: string) {
    return game.activeColor == Color.Black
        ? username == game.black
        : username == game.red;
}
