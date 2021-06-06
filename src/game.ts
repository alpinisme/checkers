import { Board, Color } from "./move";

export function isGameOver(board: Board) {
    return (
        board.every((piece) => piece.color == Color.Black) ||
        board.every((piece) => piece.color == Color.Red)
    );
}
