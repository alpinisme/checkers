import { notDeepEqual } from "assert";
import {
    AttemptFailure,
    attemptMove,
    AttemptSuccess,
    Board,
    Move,
    Piece,
    Position,
} from "../src/game";

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

        const attempt = attemptMove(boardStart, move) as AttemptSuccess;

        expect(attempt.isSuccessful).toEqual(true);
        expect(attempt.result).toStrictEqual(boardEnd);
        expect(attempt.result).not.toStrictEqual(boardStart);
    });
});
