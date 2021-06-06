import {
    AttemptFailure,
    attemptMove,
    AttemptSuccess,
    Board,
    Color,
    Move,
    Piece,
    Position,
} from "../src/move";

describe("piece movement", () => {
    it("a piece should be able to move", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = attemptMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result).toStrictEqual(boardEnd);
        expect(attempt.result).not.toStrictEqual(boardStart);
    });

    it("a piece should only be able to move diagonally", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [1, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual("Illegal move");
    });

    it("a piece should be able to capture another piece", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [3, 3];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };
        const capturedPiece: Piece = {
            type: "standard",
            color: Color.Red,
            position: [2, 2],
        };

        const boardStart: Board = [piece, capturedPiece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = attemptMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result.includes(capturedPiece)).toEqual(false);
        expect(attempt.result).toStrictEqual(boardEnd);
    });

    it("a piece should only be able to move one space when not capturing", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [3, 3];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual(
            "Illegal move: No piece exists to capture"
        );
    });

    it("a piece should not be able to capture another piece of its own color", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [3, 3];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };
        const capturedPiece: Piece = {
            type: "standard",
            color: Color.Black,
            position: [2, 2],
        };

        const boardStart: Board = [piece, capturedPiece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual(
            "Illegal move: Cannot capture your own piece"
        );
    });

    it("a standard piece should not be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual("Illegal move");
    });

    it("a king should be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece: Piece = {
            type: "king",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(true);
    });

    it("a piece should only be able to move one space when not capturing", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const obstructingPiece = {
            ...piece,
            position: illegalMoveEnd,
        };

        const boardStart: Board = [piece, obstructingPiece];

        const attempt = attemptMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual("Illegal move: Piece in the way");
    });
});
