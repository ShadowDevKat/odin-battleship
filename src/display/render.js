import {
    ATTACK_RESULTS,
    GRID_SIZE
} from "../modules/globals.js";

export const Render = {
    popUp: document.querySelector(".pop-up"),

    drawBoard(container, size = GRID_SIZE) {
        if (!container) return;
        container.innerHTML = "";

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement("div");
                cell.classList.add("box");
                cell.dataset.row = r;
                cell.dataset.column = c;
                cell.setAttribute("aria-label", `Cell ${Render.coordToLabel([r, c])}`);
                container.appendChild(cell);
            }
        }
    },

    coordToLabel([r, c]) {
        const letter = String.fromCharCode("A".charCodeAt(0) + r);
        return `${letter}${c + 1}`;
    },

    renderShipOnBoard(
        board,
        coordinates = [],
        axis = "X",
        ship = { name: "ship" },
        hidden = false
    ) {
        if (!board) return;

        // mark cells
        coordinates.forEach(([r, c]) => {
            const boxEl = board.querySelector(
                `.box[data-row="${r}"][data-column="${c}"]`
            );
            if (boxEl) boxEl.classList.add("placed");
            // keep shipName in DOM cell for later queries (helpful for tests or UI)
            if (boxEl) boxEl.dataset.ship = ship.name;
        });

        // ship element for css styling and "sunk" toggles
        const [row, column] = coordinates[0] ?? [0, 0];
        const shipEl = document.createElement("div");
        shipEl.classList.add("ship", axis);
        if (hidden) shipEl.classList.add("hidden-ship");
        shipEl.dataset.ship = ship.name;
        shipEl.style.setProperty("--row", row);
        shipEl.style.setProperty("--column", column);
        shipEl.style.setProperty("--length", coordinates.length ?? 1);
        board.appendChild(shipEl);
    },

    showInfo(element, message) {
        if (!element) return;
        element.textContent = message;
    },

    renderAttack(board, result, coordinates, options = {}) {
        if (!board) return;

        const coordsArray = Array.isArray(coordinates[0])
            ? coordinates
            : [coordinates];

        coordsArray.forEach(([r, c]) => {
            const boxEl = board.querySelector(
                `.box[data-row="${r}"][data-column="${c}"]`
            );
            if (!boxEl) return;

            // normalize classes: remove preview classes that might remain
            boxEl.classList.remove("preview", "preview-invalid");

            // Add visual state
            boxEl.classList.add(result);

            // Keep aria updated
            const label = `Cell ${Render.coordToLabel([r, c])} — ${result}`;
            boxEl.setAttribute("aria-label", label);
        });

        // If sunk and shipName available, mark the ship element
        if (result === ATTACK_RESULTS.SUNK && options.shipName) {
            const shipEl = board.querySelector(
                `.ship[data-ship="${options.shipName}"]`
            );
            if (shipEl) shipEl.classList.add("sunk");
        }
    },

    renderPopUp(message) {
        if (!this.popUp) return;
        const heading = this.popUp.querySelector(".pop-up-heading");
        if (heading) heading.innerText = message;
        this.popUp.classList.add("active");
        this.popUp.setAttribute("aria-hidden", "false");
    },

    hidePopUp() {
        if (!this.popUp) return;
        this.popUp.classList.remove("active");
        this.popUp.setAttribute("aria-hidden", "true");
    },
}