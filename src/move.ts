/* type declarations */

export type Position = [number, number];
export type Move = [Position, Position];
export enum Color {
    Black,
    Red,
}
export interface Piece {
    type: "standard" | "king";
    color: Color;
    position: Position;
}
export type Board = Piece[];
export type AttemptSuccess = {
    isSuccessful: true;
    result: Board;
};
export type AttemptFailure = {
    isSuccessful: false;
    error: string;
};
export type AttemptResult = AttemptSuccess | AttemptFailure;
type MoveType = "standard" | "capture" | "illegal";

/*
    Example board layout:
    (0,0) (0,1) (0,2) (0,3)
    (1,0) (1,1) (1,2) (1,3)
    (2,0) (2,1) (2,2) (2,3)
    (3,0) (3,1) (3,2) (3,3)

    Black starts on the 0 side
*/

/* helper functions */

function succeed(board: Board): AttemptSuccess {
    return {
        isSuccessful: true,
        result: board,
    };
}

function fail(message: string): AttemptFailure {
    return {
        isSuccessful: false,
        error: message,
    };
}

function shouldPromote(piece: Piece) {
    if (piece.type == "king") return false;
    const row = piece.position[0];
    return piece.color == Color.Black ? row == 7 : row == 0;
}

function movePiece(
    board: Board,
    activePiece: Piece,
    position: Position
): Board {
    const index = board.findIndex((piece) => piece == activePiece);

    if (index == -1) {
        throw new Error(
            "Attempting to move a piece that doesn't exist on the board"
        );
    }

    const newPiece = { ...activePiece, position };

    if (shouldPromote(newPiece)) {
        newPiece.type = "king";
    }

    return [...board.slice(0, index), newPiece, ...board.slice(index + 1)];
}

function removePieceFromBoard(board: Piece[], pieceToRemove: Piece) {
    const index = board.findIndex((piece) => pieceToRemove == piece);
    if (index == -1) {
        throw new Error(
            "Attempting to remove a piece that doesn't exist on the board"
        );
    }
    return [...board.slice(0, index), ...board.slice(index + 1)];
}

function determineMoveType(move: Move, piece: Piece): MoveType {
    const [start, end] = move;
    const vOffset = end[0] - start[0];
    const vDistance = Math.abs(vOffset);
    const hDistance = Math.abs(end[1] - start[1]);
    const isDiagonal = hDistance / vDistance == 1;
    const isBackwards = piece.color == Color.Black ? vOffset < 0 : vOffset > 0;

    if (!isDiagonal) {
        return "illegal";
    }

    if (isBackwards && piece.type != "king") {
        return "illegal";
    }

    switch (vDistance) {
        case 1:
            return "standard";

        case 2:
            return "capture";

        default:
            return "illegal";
    }
}

function attemptCapture(
    board: Board,
    move: Move,
    activePiece: Piece
): AttemptResult {
    const [start, end] = move;
    const offsetY = end[0] - start[0];
    const offsetX = end[1] - start[1];
    const capturedY = offsetY > 0 ? start[0] + 1 : start[0] - 1;
    const capturedX = offsetX > 0 ? start[1] + 1 : start[1] - 1;
    const capturedPiece = board.find(
        (piece) =>
            piece.position[0] == capturedY && piece.position[1] == capturedX
    );

    if (capturedPiece == undefined) {
        return fail("Illegal move: No piece exists to capture");
    }

    if (capturedPiece.color == activePiece.color) {
        return fail("Illegal move: Cannot capture your own piece");
    }

    const boardAfterCapture = removePieceFromBoard(board, capturedPiece);
    const boardAfterMove = movePiece(boardAfterCapture, activePiece, end);

    return succeed(boardAfterMove);
}

/* core module export */

// assume that move starts at a valid position (with correct color piece) on the board and validate that before this point in program
export function attemptMove(board: Board, move: Move): AttemptResult {
    const [start, end] = move;
    const activePiece = board.find((piece) => piece.position == start);
    const obstructingPiece = board.find((piece) => piece.position == end);

    if (activePiece == undefined) {
        return fail(
            "Invalid start for move: piece does not exist in that location"
        );
    }

    if (obstructingPiece) {
        return fail("Illegal move: Piece in the way");
    }

    const moveType = determineMoveType(move, activePiece);

    switch (moveType) {
        case "illegal":
            return fail("Illegal move");

        case "capture":
            return attemptCapture(board, move, activePiece);

        case "standard":
            return succeed(movePiece(board, activePiece, end));

        default:
            throw new Error("Unknown case for moveType: " + moveType);
    }
}
