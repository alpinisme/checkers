import {
    AttemptFailure,
    AttemptSuccess,
    Move,
    makeMove,
} from "../../src/models/move";
import {
    Board,
    Color,
    Piece,
    Position,
    PieceType,
    makePiece,
} from "../../src/models/board";

describe("piece movement", () => {
    it("a piece should be able to move", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = makeMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toEqual(boardEnd);
        expect(attempt.result).not.toEqual(boardStart);
    });

    it("a piece should only be able to move diagonally", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [1, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe("Illegal move");
    });

    it("a piece should be able to capture another piece", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [3, 3];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart);
        const capturedPiece = makePiece(Color.Red, [2, 2]);

        const boardStart: Board = [piece, capturedPiece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = makeMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result.includes(capturedPiece)).toBe(false);
        expect(attempt.result).toEqual(boardEnd);
    });

    it("a piece should only be able to move one space when not capturing", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [3, 3];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe("Illegal move: No piece exists to capture");
    });

    it("a piece should not be able to capture another piece of its own color", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [3, 3];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart);
        const capturedPiece = makePiece(Color.Black, [2, 2]);

        const boardStart: Board = [piece, capturedPiece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe(
            "Illegal move: Cannot capture your own piece"
        );
    });

    it("a standard piece should not be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe("Illegal move");
    });

    it("a king should be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece = makePiece(Color.Black, moveStart, PieceType.King);

        const boardStart: Board = [piece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(true);
    });

    it("a piece should only be able to move one space when not capturing", () => {
        const moveStart: Position = [1, 1];
        const illegalMoveEnd: Position = [2, 2];

        const move: Move = [moveStart, illegalMoveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const obstructingPiece = {
            ...piece,
            position: illegalMoveEnd,
        };

        const boardStart: Board = [piece, obstructingPiece];

        const attempt = makeMove(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe("Illegal move: Piece in the way");
    });

    it("a standard piece should be promoted to king when it reaches opponent's home row", () => {
        const moveStart: Position = [6, 6];
        const moveEnd: Position = [7, 7];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];
        const boardEnd: Board = [
            { ...piece, position: moveEnd, type: PieceType.King },
        ];

        const attempt = makeMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toEqual(boardEnd);
    });

    it("a standard piece should not be promoted to king outside opponent's home row", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart);

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = makeMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toEqual(boardEnd);
    });

    it("a king should be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece = makePiece(Color.Black, moveStart, PieceType.King);

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = makeMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toEqual(boardEnd);
    });

    it("a piece should be able to execute multiple captures in a single turn", () => {
        const position1: Position = [0, 0];
        const position2: Position = [2, 2];
        const position3: Position = [4, 0];
        const capturePosition1: Position = [1, 1];
        const capturePosition2: Position = [3, 1];

        const turn = [position1, position2, position3];

        const piece = makePiece(Color.Black, position1);

        const capturedPiece1 = makePiece(Color.Red, capturePosition1);
        const capturedPiece2 = makePiece(Color.Red, capturePosition2);

        const boardStart: Board = [capturedPiece1, piece, capturedPiece2];
        const boardEnd: Board = [{ ...piece, position: position3 }];

        const attempt = makeMove(boardStart, turn) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toEqual(boardEnd);
    });

    it("a piece should be not able to execute a regular move after a capture in a single turn", () => {
        const position1: Position = [0, 0];
        const position2: Position = [2, 2];
        const position3: Position = [3, 3];
        const capturePosition1: Position = [1, 1];

        const turn = [position1, position2, position3];

        const piece: Piece = makePiece(Color.Black, position1);
        const capturedPiece1 = makePiece(Color.Red, capturePosition1);

        const boardStart: Board = [capturedPiece1, piece];

        const attempt = makeMove(boardStart, turn) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe(
            "Illegal move: Multiple moves are only allowed in a turn if all are captures"
        );
    });
});
