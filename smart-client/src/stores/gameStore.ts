// src/stores/gameStore.ts

import { writable, get } from 'svelte/store';
import type { GamePieceOption, BoardLocation } from '../interfaces';

// ---------------------------------------------
// 1. Define initial data
// ---------------------------------------------

const initialBoardLocations: BoardLocation[] = [
    { row: 0, col: 0, name: 'A1', piece: null },
    { row: 0, col: 1, name: 'A2', piece: null },
    { row: 0, col: 2, name: 'A3', piece: null },
    { row: 0, col: 3, name: 'A4', piece: null },
    { row: 1, col: 0, name: 'B1', piece: null },
    { row: 1, col: 1, name: 'B2', piece: null },
    { row: 1, col: 2, name: 'B3', piece: null },
    { row: 1, col: 3, name: 'B4', piece: null },
    { row: 2, col: 0, name: 'C1', piece: null },
    { row: 2, col: 1, name: 'C2', piece: null },
    { row: 2, col: 2, name: 'C3', piece: null },
    { row: 2, col: 3, name: 'C4', piece: null },
    { row: 3, col: 0, name: 'D1', piece: null },
    { row: 3, col: 1, name: 'D2', piece: null },
    { row: 3, col: 2, name: 'D3', piece: null },
    { row: 3, col: 3, name: 'D4', piece: null }
];

const allGamePieces: GamePieceOption[] = [
    { color: 0, size: 0, outline: 0, shape: 0, name: '0000' },
    { color: 0, size: 0, outline: 0, shape: 1, name: '0001' },
    { color: 0, size: 0, outline: 1, shape: 0, name: '0010' },
    { color: 0, size: 0, outline: 1, shape: 1, name: '0011' },
    { color: 0, size: 1, outline: 0, shape: 0, name: '0100' },
    { color: 0, size: 1, outline: 0, shape: 1, name: '0101' },
    { color: 0, size: 1, outline: 1, shape: 0, name: '0110' },
    { color: 0, size: 1, outline: 1, shape: 1, name: '0111' },
    { color: 1, size: 0, outline: 0, shape: 0, name: '1000' },
    { color: 1, size: 0, outline: 0, shape: 1, name: '1001' },
    { color: 1, size: 0, outline: 1, shape: 0, name: '1010' },
    { color: 1, size: 0, outline: 1, shape: 1, name: '1011' },
    { color: 1, size: 1, outline: 0, shape: 0, name: '1100' },
    { color: 1, size: 1, outline: 0, shape: 1, name: '1101' },
    { color: 1, size: 1, outline: 1, shape: 0, name: '1110' },
    { color: 1, size: 1, outline: 1, shape: 1, name: '1111' }
];

// ---------------------------------------------
// 2. Create Svelte writable stores
// ---------------------------------------------

export const unPlayedPieces = writable<GamePieceOption[]>([]);
export const playedPieces = writable<GamePieceOption[]>([]);
export const selectedPiece = writable<GamePieceOption | null>(null);
export const boardLocations = writable<BoardLocation[]>([]);

export const showWinModal = writable(false);
export const winner = writable<string | null>(null);


export const currentPlayer = writable<'John' | 'Sophie'>('John');
export const me = writable<'John' | 'Sophie' | null>(null);

export const showModal = writable<boolean>(true);
export const showChooseNewGameModal = writable<boolean>(false);

export const fetchingEnabled = writable<boolean>(true);
export const action = writable<'Choose Piece For Next Player' | 'Place Your Piece'>(
    'Choose Piece For Next Player'
);

export const startNewGame = writable<boolean>(false);

// ---------------------------------------------
// 3. Define game logic
// ---------------------------------------------

let pullInterval: any = null;

// init function
export async function initGame() {
    const _startNewGame = get(startNewGame);
    const _action = get(action);

    // randomly assign the first player
    currentPlayer.set(Math.random() > 0.5 ? 'John' : 'Sophie');
    action.set('Choose Piece For Next Player');

    if (_startNewGame) {
        unPlayedPieces.set(allGamePieces.map(p => ({ ...p, selected: false, placed: false })));
        playedPieces.set([]);
        boardLocations.set(initialBoardLocations.map(loc => ({ ...loc })));
        await pushToServer();
    } else {
        await pullFromServer();
    }

    if (pullInterval) clearInterval(pullInterval);
    pullInterval = setInterval(() => {
        pullFromServer();
    }, 500);
}

// choose a player from modal
export function choosePlayer(player: 'John' | 'Sophie') {
    me.set(player);
    showModal.set(false);
    showChooseNewGameModal.set(true);
}

// decide to start new game
export function chooseToStartNewGame(decision: boolean) {
    startNewGame.set(decision);
    showChooseNewGameModal.set(false);
    initGame();
}

// handle selecting a piece for the other player
export async function handleSelecting(pieceName: string) {
    const canPlay = isMyTurn() && isSelectingPhase();
    if (!canPlay) return;

    unPlayedPieces.update(pieces =>
        pieces.map(p =>
            p.name === pieceName ? { ...p, selected: true } : { ...p, selected: false }
        )
    );

    const updated = get(unPlayedPieces).find(p => p.name === pieceName) || null;
    selectedPiece.set(updated);

    updateAction();
    updatePlayer();

    // temporarily stop fetching
    fetchingEnabled.set(false);
    await pushToServer();
    // resume fetching
    fetchingEnabled.set(true);
}

export function startNewGameFromWin() {
    showWinModal.set(false);  // close the modal
    winner.set(null);         // clear winner
    startNewGame.set(true);   // signal a new game is to start
    initGame();               // actually re-initialize the game
}

// place the selected piece on a location
export async function playPiece(locationName: string) {
    const _selectedPiece = get(selectedPiece);
    const canPlay = _selectedPiece && isMyTurn() && isPlacingPhase();
    if (!canPlay) return;

    boardLocations.update(locations => {
        const locationObject = locations.find(loc => loc.name === locationName);
        if (!locationObject || locationObject.piece) return locations; // can't place if occupied

        locationObject.piece = _selectedPiece!.name;
        return locations;
    });

    unPlayedPieces.update(pieces => pieces.filter(p => p.name !== _selectedPiece!.name));
    playedPieces.update(pieces => [
        ...pieces,
        { ..._selectedPiece, selected: false, placed: true } as GamePieceOption
    ]);
    selectedPiece.set(null);

    updateAction();

    fetchingEnabled.set(false);
    await pushToServer();
    fetchingEnabled.set(true);

    if (checkForWin()) {
        handleWin();
    }
}

// check if there's a win
export function checkForWin(): boolean {
    const locs = get(boardLocations);
    const played = get(playedPieces);

    // helper to get a piece by name from played array
    function getPlayedPiece(name: string | null | undefined) {
        if (!name) return null;
        return played.find(p => p.name === name) || null;
    }

    // check sequence
    function checkSequenceForWin(
        a: GamePieceOption | null,
        b: GamePieceOption | null,
        c: GamePieceOption | null,
        d: GamePieceOption | null
    ): boolean {
        if (!a || !b || !c || !d) return false;
        const sameSize = a.size === b.size && b.size === c.size && c.size === d.size;
        const sameColor = a.color === b.color && b.color === c.color && c.color === d.color;
        const sameOutline =
            a.outline === b.outline && b.outline === c.outline && c.outline === d.outline;
        const sameShape = a.shape === b.shape && b.shape === c.shape && c.shape === d.shape;

        return sameSize || sameColor || sameOutline || sameShape;
    }

    // rows
    for (let i = 0; i < 4; i++) {
        const row = locs.filter(loc => loc.row === i);
        const pieces = row.map(loc => getPlayedPiece(loc.piece));
        if (checkSequenceForWin(pieces[0], pieces[1], pieces[2], pieces[3])) return true;
    }

    // columns
    for (let i = 0; i < 4; i++) {
        const col = locs.filter(loc => loc.col === i);
        const pieces = col.map(loc => getPlayedPiece(loc.piece));
        if (checkSequenceForWin(pieces[0], pieces[1], pieces[2], pieces[3])) return true;
    }

    // diagonal 1
    if (
        checkSequenceForWin(
            getPlayedPiece(locs[0].piece),
            getPlayedPiece(locs[5].piece),
            getPlayedPiece(locs[10].piece),
            getPlayedPiece(locs[15].piece)
        )
    ) {
        return true;
    }

    // diagonal 2
    if (
        checkSequenceForWin(
            getPlayedPiece(locs[3].piece),
            getPlayedPiece(locs[6].piece),
            getPlayedPiece(locs[9].piece),
            getPlayedPiece(locs[12].piece)
        )
    ) {
        return true;
    }

    return false;
}

// handle a win scenario
function handleWin() {
    const _currentPlayer = get(currentPlayer);
    winner.set(_currentPlayer);       // store who won
    showWinModal.set(true);           // trigger the modal
}

// ---------------------------------------------
// 4. Utility functions
// ---------------------------------------------

function updateAction() {
    const _action = get(action);
    action.set(_action === 'Choose Piece For Next Player' ? 'Place Your Piece' : 'Choose Piece For Next Player');
}

function updatePlayer() {
    const _current = get(currentPlayer);
    currentPlayer.set(_current === 'John' ? 'Sophie' : 'John');
}

// For now, skipping real multi-user logic. You might customize if needed.
function isMyTurn(): boolean {
    const _me = get(me);
    const _current = get(currentPlayer);
    // Return true if the current player is me:
    // return _current === _me;
    // For the original code that forced true, just keep:
    return true;
}

function isSelectingPhase(): boolean {
    return get(action) === 'Choose Piece For Next Player';
}

function isPlacingPhase(): boolean {
    return get(action) === 'Place Your Piece';
}




// ---------------------------------------------
// 5. Server communication
// ---------------------------------------------

export async function pullFromServer() {
    if (!get(fetchingEnabled)) return;
    const response = await fetch('https://cookiestoeat.com/quarto');
    if (response.ok && get(fetchingEnabled)) {
        const data = await response.json();
        const state = data.state;

        unPlayedPieces.set(state.unPlayedPieces);
        playedPieces.set(state.playedPieces);
        boardLocations.set(state.boardLocations);
        selectedPiece.set(state.selectedPiece);

        if (get(action) !== state.action || get(currentPlayer) !== state.currentPlayer) {
            // A naive check to see if we should check for win
            checkForWin();
        }
        currentPlayer.set(state.currentPlayer);
        action.set(state.action);
    } else if (!response.ok) {
        alert('HTTP-Error: ' + response.status);
    }
}

export async function pushToServer() {
    const dataObj = {
        state: {
            unPlayedPieces: get(unPlayedPieces),
            playedPieces: get(playedPieces),
            boardLocations: get(boardLocations),
            currentPlayer: get(currentPlayer),
            selectedPiece: get(selectedPiece),
            action: get(action)
        }
    };

    await fetch('https://cookiestoeat.com/quarto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    });
}
