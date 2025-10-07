import { Ship } from "./ship.js";
import {
    ATTACK_RESULTS,
    AXIS,
    GRID_SIZE,
    SHIP_DATA,
    CELL_STATE,
} from "./globals.js";

export class GameBoard {
    constructor() {
        this.board = Array.from({ length: GRID_SIZE }, () =>
            Array.from({ length: GRID_SIZE }, () => ({ state: CELL_STATE.EMPTY }))
        );

        this.fleet = {};

        this.directions = {
            [AXIS.X]: [0, 1],
            [AXIS.Y]: [1, 0]
        };
    }

    placeShip(shipName, [row, col], axis) {
        if (!SHIP_DATA[shipName]) throw new Error(`Invalid ship: ${shipName}`);
        if (this.fleet[shipName]) throw new Error(`${shipName} already placed`);

        const ship = new Ship(shipName, SHIP_DATA[shipName]);
        const coords = this.#isValidPlacement([row, col], ship.length, axis);

        coords.forEach(([r, c]) => {
            this.board[r][c] = { state: CELL_STATE.SHIP, shipName };
        });

        this.fleet[shipName] = { ship, coordinates: coords, axis };
        return this.fleet[shipName];
    }

    #isValidPlacement([row, col], length, axis) {
        const [dr, dc] = this.directions[axis];
        const coords = [];

        for (let i = 0; i < length; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
                throw new Error("Out of bounds");
            }
            if (this.board[r][c].state !== CELL_STATE.EMPTY) {
                throw new Error("Cell already occupied");
            }

            coords.push([r, c]);
        }
        return coords;
    }

    autoPlaceFleet() {
        for (const shipName of Object.keys(SHIP_DATA)) {
            this.#placeRandomly(shipName);
        }
    }

    #placeRandomly(shipName) {
        let placed = false;
        while (!placed) {
            try {
                const axis = Math.random() < 0.5 ? AXIS.X : AXIS.Y;
                const row = Math.floor(Math.random() * GRID_SIZE);
                const col = Math.floor(Math.random() * GRID_SIZE);
                this.placeShip(shipName, [row, col], axis);
                placed = true;
            } catch {
                // retry until valid placement
            }
        }
    }

    receiveAttack(row, col) {
        const cell = this.board[row][col];

        switch (cell.state) {
            case CELL_STATE.MISS:
            case CELL_STATE.HIT:
            case CELL_STATE.SUNK:
                return { result: ATTACK_RESULTS.ALREADY, coordinates: [row, col] };

            case CELL_STATE.EMPTY:
                cell.state = CELL_STATE.MISS;
                return { result: ATTACK_RESULTS.MISS, coordinates: [row, col] };

            case CELL_STATE.SHIP:
                return this.#handleHit(row, col, cell);

            default:
                throw new Error(`Unknown cell state: ${cell.state}`);
        }
    }

    #handleHit(row, col, cell) {
        const { shipName } = cell;
        const ship = this.fleet[shipName].ship;
        ship.hit();

        this.board[row][col].state = CELL_STATE.HIT;

        if (!ship.isSunk()) {
            return { result: ATTACK_RESULTS.HIT, coordinates: [row, col] };
        }

        // mark all ship cells as sunk
        this.fleet[shipName].coordinates.forEach(([r, c]) => {
            this.board[r][c].state = CELL_STATE.SUNK;
        });

        return {
            result: ATTACK_RESULTS.SUNK,
            coordinates: [row, col],
            sunkShip: this.fleet[shipName],
        };
    }

    allShipsPlaced() {
        return Object.keys(this.fleet).length === Object.keys(SHIP_DATA).length;
    }

    allShipsSunk() {
        return Object.values(this.fleet).every(({ ship }) => ship.isSunk());
    }
}
