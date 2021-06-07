import { Color, makeNewBoard } from "../src/models/board";

describe("Board creation", () => {
    test("A new board has 24 pieces", () => {
        expect(makeNewBoard().length).toBe(24);
    });

    test("Each color has 12 pieces on a new board", () => {
        const board = makeNewBoard();
        const black = board.filter((piece) => piece.color == Color.Black);
        expect(black.length).toBe(12); // since only two colors, red must also have 12
    });

    test("Each color has 12 pieces on a new board", () => {
        const board = makeNewBoard();
        const black = board.filter((piece) => piece.color == Color.Black);
        expect(black.length).toBe(12); // since only two colors, red must also have 12
    });
});
