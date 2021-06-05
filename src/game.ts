export type Position = [number, number];

export type Move = [Position, Position];

export interface Piece {
    type: "standard" | "king";
    color: "black" | "red";
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

/*
    Example board layout:
    (0,0) (0,1) (0,2) (0,3)
    (1,0) (1,1) (1,2) (1,3)
    (2,0) (2,1) (2,2) (2,3)
    (3,0) (3,1) (3,2) (3,3)

    Black starts on the 0 side
*/

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

function movePiece(
    board: Piece[],
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

    return [...board.slice(0, index), newPiece, ...board.slice(index + 1)];
}

// assume that move starts at a valid position (with correct color piece) on the board and validate that before this point in program
export function attemptMove(board: Board, move: Move): AttemptResult {
    const [start, end] = move;
    const activePiece = board.find((piece) => piece.position == start);

    if (activePiece == undefined) {
        return fail(
            "Invalid start for move: piece does not exist in that location"
        );
    }

    const resultingBoard = movePiece(board, activePiece, end);

    return succeed(resultingBoard);
}
