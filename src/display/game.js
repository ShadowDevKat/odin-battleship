import { Player } from "../modules/player.js"

export class Game {
    constructor() {
        this.UI = {
            game_state: document.querySelector("#game-status"),
        };

        this.humanPlayer = new Player();
        this.computerPlayer = new Player("computer", true);

        this.test();
    }

    test() {
        this.humanPlayer.placeShipsRandomly();
        this.computerPlayer.placeShipsRandomly();
        this.UI.game_state.innerText = "waiting for players";
    }
}