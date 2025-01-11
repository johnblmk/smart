// src/interfaces.ts

export interface GamePieceOption {
    color: 0 | 1;
    size: 0 | 1;
    outline: 0 | 1;
    shape: 0 | 1;
    name: string;
    selected?: boolean;
    placed?: boolean;
}

export interface BoardLocation {
    row: number;
    col: number;
    name: string;
    piece?: string | null;
}
