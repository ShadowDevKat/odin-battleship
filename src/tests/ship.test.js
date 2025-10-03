import { Ship } from "../scripts/ship"

test("does ship get made with default length", () => {
    const ship = new Ship();
    expect(ship.length).toBe(1);
});

test("does ship get made with provided length", () => {
    const ship = new Ship(5);
    expect(ship.length).toBe(5);
});

test("does ship hit update", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.hitCount).toBe(1);
});

test("does ship sink properly", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
});