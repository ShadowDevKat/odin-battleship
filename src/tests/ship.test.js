import { Ship } from "../modules/ship.js"

describe("Ship Class", () => {
    test("Ship should be created with correct name and length", () => {
        const ship = new Ship("ship", 4);
        expect(ship.name).toBe("ship");
        expect(ship.length).toBe(4);
        expect(ship.hitCount).toBe(0);
    });

    test("Error should be thrown length is negative", () => {
        expect(() => new Ship("ship", 0)).toThrow(
            "Ship length must be a positive integer"
        );
        expect(() => new Ship("ship", -5)).toThrow(
            "Ship length must be a positive integer"
        );
        expect(() => new Ship("ship", 1.5)).toThrow(
            "Ship length must be a positive integer"
        );
        expect(() => new Ship("ship", "ship")).toThrow(
            "Ship length must be a positive integer"
        );
    });

    test("hit() should increase hit count", () => {
        const ship = new Ship("ship", 4);
        ship.hit();
        expect(ship.hitCount).toBe(1);
        ship.hit();
        expect(ship.hitCount).toBe(2);
    });

    test("hit() should not exceed ship length", () => {
        const ship = new Ship("ship", 3);
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hitCount).toBe(3);
    });

    test("isSunk() should return false when hit count < length", () => {
        const ship = new Ship("ship", 4);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBeFalsy();
    });

    test("isSunk() should return true when hits >= length", () => {
        const ship = new Ship("ship", 2);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBeTruthy();
    });
});