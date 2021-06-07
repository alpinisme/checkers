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
