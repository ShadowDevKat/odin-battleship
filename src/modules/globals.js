export const GRID_SIZE = 10;

export const SHIP_DATA = Object.freeze({
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrolBoat: 2,
});

export const AXIS = Object.freeze({
    X: "X",
    Y: "Y",
});

export const CELL_STATE = Object.freeze({
    EMPTY: "empty",
    SHIP: "ship",
    HIT: "hit",
    MISS: "miss",
    SUNK: "sunk",
});

export const ATTACK_RESULTS = Object.freeze({
    MISS: "miss",
    HIT: "hit",
    SUNK: "sunk",
    ALREADY: "already",
});