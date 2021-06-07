/* type declarations */

export type Position = [number, number];

export enum PieceType {
    Standard,
    King,
}
export enum Color {
    Black,
    Red,
}
export interface Piece {
    type: PieceType;
    color: Color;
    position: Position;
}
export type Board = Piece[];

/* core module exports */

export function makePiece(
    color: Color,
    position: Position,
    type: PieceType = PieceType.Standard
): Piece {
    return {
        color,
        type,
        position,
    };
}

export function makeNewBoard() {
    const boardSize = 8;
    const board: Board = [];

    for (let i = 0; i < boardSize; i++) {
        if (i % 2 != 0) {
            board.push(makePiece(Color.Black, [0, i])); // row 0
            board.push(makePiece(Color.Black, [2, i])); // row 2
            board.push(makePiece(Color.Red, [6, i])); // row 6
        } else {
            board.push(makePiece(Color.Black, [1, i])); // row 2
            board.push(makePiece(Color.Red, [5, i])); // row 5
            board.push(makePiece(Color.Red, [7, i])); // row 7
        }
    }

    return board;
}
