export class Ship {
    constructor(name, length) {
        if (!Number.isInteger(length) || length < 1) {
            throw new Error("Ship length must be a positive integer");
        }
        this.name = name;
        this.length = length;
        this.hitCount = 0;
    }

    hit() {
        if (this.hitCount < this.length) {
            this.hitCount++;
        }
    }

    isSunk() {
        return this.hitCount >= this.length;
    }
}