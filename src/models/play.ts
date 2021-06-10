/* helper functions */

import { GameError } from "../errors/GameError";
import { Board, Color, getPiece, isOffBoard, Position } from "./board";
import { Game } from "./game";
import { makeMove } from "./move";
import equal from "deep-equal";

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

export interface TurnRequest {
    board: Board;
    turn: Position[];
}

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

export function isPlayersTurn(game: Game, username: string) {
    return game.activeColor == Color.Black
        ? username == game.black
        : username == game.red;
}
