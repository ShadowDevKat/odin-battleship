import { GRID_SIZE } from "../modules/globals.js";
import { Player } from "../modules/player.js"
import { Render } from "./render.js";

export class Game {
    constructor() {
        this.UI = {
            game_state: document.querySelector("#game-status"),
            humanBoard: document.querySelector(".human-board"),
            computerBoard: document.querySelector(".computer-board"),
        };

        this.humanPlayer = new Player();
        this.computerPlayer = new Player("computer", true);

        this.test();
    }

    test() {
        this.humanPlayer.placeShipsRandomly();
        this.computerPlayer.placeShipsRandomly();
        this.UI.game_state.innerText = "waiting for players";
        Render.drawBoard(this.UI.humanBoard, GRID_SIZE);
        Render.drawBoard(this.UI.computerBoard, GRID_SIZE);
    }
}