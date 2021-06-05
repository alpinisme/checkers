import { replaceItemAtIndex } from "./utils";

export type Position = [number, number];

export type Move = [Position, Position];

export interface Piece {
    type: "standard" | "king";
    color: "black" | "red";
    position: Position;
}

export type Board = Piece[];

// assume that move starts at a valid position (with correct color piece) on the board and validate that before this point in program
export function attemptMove(board: Board, move: Move): Board {
    const [start, end] = move;
    const activePieceIndex = board.findIndex(
        (piece) => piece.position == start
    );
    if (activePieceIndex == -1) {
        throw new Error(
            "Invalid start for move: piece does not exist in that location"
        );
    }
    const activePieceStart = board[activePieceIndex];
    const activePieceEnd = { ...activePieceStart, position: end };
    const resultingBoard = replaceItemAtIndex(
        board,
        activePieceIndex,
        activePieceEnd
    );
    return resultingBoard;
}
