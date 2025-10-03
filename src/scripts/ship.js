export class Ship {
    constructor(length = 1) {
        this.length = length;
        this.hitCount = 0;
    }

    hit() {
        this.hitCount++;
    }
    
    isSunk() {
        return this.hitCount >= this.length;
    }
}