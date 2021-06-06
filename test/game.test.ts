import { isGameOver } from "../src/game";
import { Color, Piece } from "../src/move";

describe("game play", () => {
    test("game should be over iff only one player has pieces on board", () => {
        const blackPiece: Piece = {
            type: "standard",
            color: Color.Black,
            position: [1, 1],
        };
        const redPiece = { ...blackPiece, color: Color.Red };
        const blackVictory = [blackPiece];
        const redVictory = [redPiece];
        const liveGame = [blackPiece, redPiece];
        expect(isGameOver(blackVictory)).toEqual(true);
        expect(isGameOver(redVictory)).toEqual(true);
        expect(isGameOver(liveGame)).toEqual(false);
    });

    test("a turn can include");
});
