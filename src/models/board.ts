import { hasKeys } from "../utils";
import equal from "deep-equal";

/*
    Example board layout:
    (0,0) (0,1) (0,2) (0,3)
    (1,0) (1,1) (1,2) (1,3)
    (2,0) (2,1) (2,2) (2,3)
    (3,0) (3,1) (3,2) (3,3)

    Black starts on the 0 side
*/

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

/* helper */

function isPiece(piece: any): piece is Piece {
    if (!hasKeys(piece, ["type", "color", "position"])) {
        return false;
    }
    return piece.position.length == 2;
}

/* core module exports */

export function isOffBoard(position: Position) {
    const y = position[0];
    const x = position[1];
    // board is 8 x 8, with 0-indexed positions
    return y < 0 || y > 7 || x < 0 || x > 7;
}

export function isBoard(board: any): board is Board {
    return board.map ? board.map(isPiece) : false;
}

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

export function getPiece(board: Board, position: Position): Piece | undefined {
    return board.find((piece) => equal(piece.position, position));
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
