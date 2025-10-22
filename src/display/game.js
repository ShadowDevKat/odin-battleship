import {
    ATTACK_RESULTS,
    GRID_SIZE
} from "../modules/globals.js";
import { Player } from "../modules/player.js"
import { Render } from "./render.js";

export class Game {
    constructor() {
        this.UI = {
            gameStatus: document.querySelector("#game-status"),
            humanBoard: document.querySelector(".human-board"),
            computerBoard: document.querySelector(".computer-board"),
            popUp: document.querySelector(".pop-up"),
            popUpInput: document.querySelector(".pop-up input"),
            confirmNameBtn: document.querySelector(".confirm-name-btn"),
        };

        this.init();
    }

    init() {
        this.player = null;
        this.cPlayer = null;

        Render.drawBoard(this.UI.humanBoard, GRID_SIZE);
        Render.drawBoard(this.UI.computerBoard, GRID_SIZE);
        this.hookEvents();

        // this.player.placeShipsRandomly();

        // this.cPlayer = new Player("Ai", true);
        // this.cPlayer.placeShipsRandomly();

        // this.isGameOver = false;
        // Render.showInfo(this.UI.gameStatus, `${this.player.name}'s turn`);
    }

    hookEvents() {
        this.UI.confirmNameBtn.addEventListener("click", () => {
            const val = this.UI.popUpInput.value;
            if (val?.trim()) this.playerName = val.trim();
            this.player = new Player(this.playerName);
            this.UI.popUp.classList.remove("initial");
            Render.hidePopUp();

            this.player.placeShipsRandomly();
            this.cPlayer = new Player("Ai", true);
            this.cPlayer.placeShipsRandomly();
            this.isGameOver = false;
            Render.showInfo(this.UI.gameStatus, `${this.player.name}'s turn`);
        });
        this.UI.computerBoard.addEventListener("click", (e) => {
            if (this.isGameOver) return;
            const cell = e.target.closest(".box");
            if (!cell) return;
            const row = +cell.dataset.row;
            const col = +cell.dataset.column;
            this.handleAttack(row, col);
        });
    }

    handleAttack(row, column) {
        if (this.isGameOver) {
            // Start game first message
            return;
        }

        const hResult = this.player.attack(this.cPlayer.board, row, column);

        // Already attacked
        if (hResult.result === ATTACK_RESULTS.ALREADY) {
            Render.showInfo(this.UI.gameStatus, "Already attacked this spot. Try another!");
            return;
        }

        // If we sunk a ship, mark every part of the sunk ship
        if (hResult.result === ATTACK_RESULTS.SUNK && hResult.sunkShip) {
            const sunkCoords = hResult.sunkShip.coordinates;
            Render.renderAttack(this.UI.computerBoard, hResult.result, sunkCoords, {
                shipName: hResult.sunkShip.ship.name,
            });
            Render.showInfo(
                this.UI.gameStatus,
                `You sunk the enemy ${hResult.sunkShip.ship.name}!`
            );
        } else {
            // single cell hit/miss
            Render.renderAttack(
                this.UI.computerBoard,
                hResult.result,
                hResult.coordinates
            );
            if (hResult.result === ATTACK_RESULTS.HIT) {
                Render.showInfo(
                    this.UI.gameStatus,
                    `Hit at ${Render.coordToLabel(hResult.coordinates)}!`
                );
            } else if (hResult.result === ATTACK_RESULTS.MISS) {
                Render.showInfo(
                    this.UI.gameStatus,
                    `Miss at ${Render.coordToLabel(hResult.coordinates)}.`
                );
            }
        }

        // Win check for player
        if (this.cPlayer.board.allShipsSunk()) {
            Render.renderPopUp(`${this.player.name} wins!`);
            this.isGameOver = true;
            return;
        }

        // Add AI delay for realism
        setTimeout(() => {
            const cResult = this.cPlayer.smartAttack(this.player.board);

            if (cResult.result === ATTACK_RESULTS.SUNK && cResult.sunkShip) {
                const sunkCoords = cResult.sunkShip.coordinates;
                Render.renderAttack(this.UI.humanBoard, ATTACK_RESULTS.SUNK, sunkCoords, {
                    shipName: cResult.sunkShip.ship.name,
                });
                Render.showInfo(
                    this.UI.gameStatus,
                    `AI sunk your ${cResult.sunkShip.ship.name}!`
                );
            } else {
                Render.renderAttack(
                    this.UI.humanBoard,
                    cResult.result,
                    cResult.coordinates
                );
                if (cResult.result === ATTACK_RESULTS.HIT) {
                    Render.showInfo(
                        this.UI.gameStatus,
                        `AI hit at ${Render.coordToLabel(cResult.coordinates)}!`
                    );
                } else if (cResult.result === ATTACK_RESULTS.MISS) {
                    Render.showInfo(
                        this.UI.gameStatus,
                        `AI missed at ${Render.coordToLabel(cResult.coordinates)}.`
                    );
                }
            }

            // Win check for AI
            if (this.player.board.allShipsSunk()) {
                Render.renderPopUp("AI wins!");
                this.isGameOver = true;
                return;
            }
        }, 1000); // <-- 1 second "thinking" delay
    }
}