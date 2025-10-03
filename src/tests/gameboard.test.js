import { GameBoard } from "../modules/gameboard.js";
import { Ship } from "../modules/ship.js";
import {
    ATTACK_RESULTS,
    AXIS,
    GRID_SIZE,
    SHIP_DATA,
    CELL_STATE,
} from "../modules/globals.js";

describe("GameBoard Class", () => {
    let board;

    beforeEach(() => {
        board = new GameBoard();
    });

    // Helper to place a ship & return an attack function
    function placeShipAndGetAttack(shipName, coords, axis) {
        board.placeShip(shipName, coords, axis);
        return (r, c) => board.receiveAttack(r, c);
    }

    // -----------------------------
    // Ship placement
    // -----------------------------
    describe("ship placement", () => {
        test("places a valid ship correctly", () => {
            const placement = board.placeShip("destroyer", [0, 0], AXIS.X);
            expect(placement.ship).toBeInstanceOf(Ship);
            expect(board.board[0][0].state).toBe(CELL_STATE.SHIP);
            expect(board.board[0][1].state).toBe(CELL_STATE.SHIP);
        });

        test("does not allow placing the same ship twice", () => {
            board.placeShip("destroyer", [0, 0], AXIS.X);
            expect(() => board.placeShip("destroyer", [2, 2], AXIS.Y)).toThrow(
                "destroyer already placed"
            );
        });

        test("throws if ship goes out of bounds", () => {
            expect(() =>
                board.placeShip("battleship", [0, GRID_SIZE - 1], AXIS.X)
            ).toThrow("Out of bounds");
        });

        test("throws if placement overlaps another ship", () => {
            board.placeShip("submarine", [0, 0], AXIS.X);
            expect(() => board.placeShip("destroyer", [0, 0], AXIS.Y)).toThrow(
                "Cell already occupied"
            );
        });

        test("autoPlaceFleet places all ships without error", () => {
            board.autoPlaceFleet();
            expect(board.allShipsPlaced()).toBeTruthy();
        });
    });

    // -----------------------------
    // Attacks
    // -----------------------------
    describe("attacks", () => {
        test("returns MISS when attacking empty water", () => {
            const result = board.receiveAttack(0, 0);
            expect(result).toEqual({
                result: ATTACK_RESULTS.MISS,
                coordinates: [0, 0],
            });
            expect(board.board[0][0].state).toBe(CELL_STATE.MISS);
        });

        test("returns HIT when attacking a ship", () => {
            const attack = placeShipAndGetAttack("destroyer", [0, 0], AXIS.X);
            const result = attack(0, 0);
            expect(result).toEqual({ result: ATTACK_RESULTS.HIT, coordinates: [0, 0] });
            expect(board.board[0][0].state).toBe(CELL_STATE.HIT);
        });

        test("returns SUNK when last part of ship is hit", () => {
            const attack = placeShipAndGetAttack("patrolBoat", [0, 0], AXIS.X); // length 2
            attack(0, 0);
            const result = attack(0, 1);
            expect(result.result).toBe(ATTACK_RESULTS.SUNK);
            expect(result.sunkShip.ship.isSunk()).toBe(true);
            expect(board.board[0][0].state).toBe(CELL_STATE.SUNK);
            expect(board.board[0][1].state).toBe(CELL_STATE.SUNK);
        });

        test("returns ALREADY if attacking the same cell twice", () => {
            const attack = placeShipAndGetAttack("destroyer", [0, 0], AXIS.X);
            attack(0, 0);
            const result = attack(0, 0);
            expect(result).toEqual({
                result: ATTACK_RESULTS.ALREADY,
                coordinates: [0, 0],
            });
        });
    });

    // -----------------------------
    // Fleet status
    // -----------------------------
    describe("fleet status", () => {
        test("allShipsPlaced returns true after placing all ships", () => {
            Object.keys(SHIP_DATA).forEach((shipName, i) => {
                board.placeShip(shipName, [i, 0], AXIS.X);
            });
            expect(board.allShipsPlaced()).toBe(true);
        });

        test("allShipsSunk returns true after all ships sunk", () => {
            const attack = placeShipAndGetAttack("patrolBoat", [0, 0], AXIS.X);
            attack(0, 0);
            attack(0, 1);
            expect(board.allShipsSunk()).toBe(true);
        });
    });
});