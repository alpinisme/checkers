import { Game, play, TurnRequest } from "../../src/models/game";
import { Color, makePiece, Piece, PieceType } from "../../src/models/board";

const blackPiece: Piece = makePiece(Color.Black, [1, 1], PieceType.King);
const redPiece: Piece = makePiece(Color.Red, [3, 3], PieceType.King);

const validRequest: TurnRequest = {
    board: [blackPiece, redPiece],
    turn: [blackPiece.position, [2, 2]],
};

const storedGame: Game = {
    board: [blackPiece, redPiece],
    activeColor: Color.Black,
    black: "joe",
    red: "peter",
};

describe("game play", () => {
    test("a player should not be able to request move on board that doesn't match stored game", () => {
        const invalidRequest: TurnRequest = {
            ...validRequest,
            board: [blackPiece],
        };
        expect(() => play(storedGame, invalidRequest)).toThrow(
            "Mismatched Boards"
        );
    });

    test("a player should not be able to request move on board of completed game", () => {
        const board = [blackPiece];
        const invalidRequest: TurnRequest = {
            ...validRequest,
            board,
        };
        const game = {
            ...storedGame,
            board,
        };
        expect(() => play(game, invalidRequest)).toThrow("Game Over");
    });

    test("a player should not be able to request move off board", () => {
        const invalidRequest: TurnRequest = {
            ...validRequest,
            turn: [blackPiece.position, [1, 10]],
        };
        expect(() => play(storedGame, invalidRequest)).toThrow("Offboard Move");
    });
});
