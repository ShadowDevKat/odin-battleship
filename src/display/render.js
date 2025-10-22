import { ATTACK_RESULTS, GRID_SIZE } from "../modules/globals.js";

export const Render = {
    drawBoard(container, size = GRID_SIZE) {
        if (!container) return;
        container.innerHTML = "";
        // container.style.setProperty("--board-size", size);

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement("div");
                cell.classList.add("box");
                cell.dataset.row = r;
                cell.dataset.column = c;
                cell.setAttribute("role", "gridcell");
                cell.setAttribute("tabindex", "0"); // keyboard focusable
                // cell.setAttribute("aria-label", `Cell ${Render.coordToLabel([r, c])}`);
                container.appendChild(cell);
            }
        }
    },
}