import {
    AttemptFailure,
    takeTurn,
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

        const attempt = takeTurn(boardStart, move) as AttemptSuccess;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

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

        const attempt = takeTurn(boardStart, move) as AttemptSuccess;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

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

        const attempt = takeTurn(boardStart, move) as AttemptFailure;

        expect(attempt.isSuccessful).toEqual(false);
        expect(attempt.error).toEqual("Illegal move: Piece in the way");
    });

    it("a standard piece should be promoted to king when it reaches opponent's home row", () => {
        const moveStart: Position = [6, 6];
        const moveEnd: Position = [7, 7];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd, type: "king" }];

        const attempt = takeTurn(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result).toStrictEqual(boardEnd);
    });

    it("a standard piece should not be promoted to king outside opponent's home row", () => {
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

        const attempt = takeTurn(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result).toStrictEqual(boardEnd);
    });

    it("a king should be able to move backward toward its home row", () => {
        const moveStart: Position = [3, 3];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "king",
            color: Color.Black,
            position: moveStart,
        };

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        const attempt = takeTurn(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result).toStrictEqual(boardEnd);
    });

    it("a piece should be able to execute multiple captures in a single turn", () => {
        const position1: Position = [0, 0];
        const position2: Position = [2, 2];
        const position3: Position = [4, 0];
        const capturePosition1: Position = [1, 1];
        const capturePosition2: Position = [3, 1];

        const turn = [position1, position2, position3];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: position1,
        };
        const capturedPiece1 = {
            ...piece,
            color: Color.Red,
            position: capturePosition1,
        };
        const capturedPiece2 = {
            ...capturedPiece1,
            position: capturePosition2,
        };

        const boardStart: Board = [capturedPiece1, piece, capturedPiece2];
        const boardEnd: Board = [{ ...piece, position: position3 }];

        const attempt = takeTurn(boardStart, turn) as AttemptSuccess;

        expect(attempt.isSuccessful).toBe(true);
        expect(attempt.result).toStrictEqual(boardEnd);
    });

    it("a piece should be not able to execute a regular move after a capture in a single turn", () => {
        const position1: Position = [0, 0];
        const position2: Position = [2, 2];
        const position3: Position = [3, 3];
        const capturePosition1: Position = [1, 1];

        const turn = [position1, position2, position3];

        const piece: Piece = {
            type: "standard",
            color: Color.Black,
            position: position1,
        };
        const capturedPiece1 = {
            ...piece,
            color: Color.Red,
            position: capturePosition1,
        };

        const boardStart: Board = [capturedPiece1, piece];

        const attempt = takeTurn(boardStart, turn) as AttemptFailure;

        expect(attempt.isSuccessful).toBe(false);
        expect(attempt.error).toBe("Illegal move");
    });
});
