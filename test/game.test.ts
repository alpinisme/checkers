import { attemptMove, Board, Move, Piece, Position } from "../src/game";

describe("piece movement", () => {
    it("a piece should be able to move", () => {
        const moveStart: Position = [1, 1];
        const moveEnd: Position = [2, 2];

        const move: Move = [moveStart, moveEnd];

        const piece: Piece = {
            type: "standard",
            color: "black",
            position: moveStart,
        };

        const boardStart: Board = [piece];
        const boardEnd: Board = [{ ...piece, position: moveEnd }];

        expect(attemptMove(boardStart, move)).toStrictEqual(boardEnd);
        expect(attemptMove(boardStart, move)).not.toStrictEqual(boardStart);
    });
});
