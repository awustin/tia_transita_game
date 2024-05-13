const matrix = require('matrix-js');

/**
 * Keeps track of the available moves in the board, based on a matrix of ingredients ids.
 * Scans the whole board on map initialization or map update.
 * Scans possible moves on chips modification
 */
export default class BoardMonitor
{
    #boardMatrix = null;

    constructor(initMatrix) {
        if (!initMatrix) {
            throw {
                message: 'Empty ingredients matrix',
                code: 'C03'
            };
        }

        this.#boardMatrix = matrix(initMatrix);
    }

    /**
     * Determines if there's any possible move in the square matrix,
     * in top-left to bottom-right direction, starting at a given point
     * @param {Integer} row If not specified, 0
     * @param {Integer} col If not specified, 0
     */
    searchMoves(row = 0, col = 0) {
        // To do: move function to a web worker to prevent from blocking main game
        const A = this.#boardMatrix;
        const nextRow = row + 1;
        const nextCol = col + 1;
        const lastRow = row === A.size()[0] - 1;
        const lastCol = col === A.size()[1] - 1;

        // Last item
        if (lastRow && lastCol) {
            return false;
        }

        if (lastCol) {
            if (A(row, col) <= 0)
                return this.searchMoves(nextRow, col);

            if (Number(A(row, col)) === Number(A(nextRow, col)))
                return true;

            return this.searchMoves(nextRow, col);
        }

        if (lastRow) {
            if (A(row, col) <= 0)
                return this.searchMoves(row, nextCol);

            if (Number(A(row, col)) === Number(A(row, nextCol)))
                return true;

            return this.searchMoves(row, nextCol);
        }

        if (!lastRow && !lastCol) {
            if (A(row, col) <= 0)
                return this.searchMoves(row, nextCol) || this.searchMoves(nextRow, col);

            if (Number(A(row, col)) === Number(A(nextRow, col)) ||
                Number(A(row, col)) === Number(A(row, nextCol)))
                return true;

            return this.searchMoves(row, nextCol) || this.searchMoves(nextRow, col);
        }
    }

    /**
     * Replaces ids for specified rows and columns.
     * @param {Object} updateMap `[...{row, col, id}]` where id = `0` represent blocked cells.
     */
    updateBoard(updateMap = []) {
        updateMap.forEach(replace => {
            const { row, col, id } = replace;

            this.#boardMatrix = matrix(this.#boardMatrix.set(row, col).to(id));
        });
    }

    /**
     * Generates a random set of cells to block. Used in effects.
     * @returns The list of blocked cells `[...[<row>,<col>]]`
     */
    blockRandomCells() {
        let A = this.#boardMatrix;
        const size = A.size()[0];
        const direction = Math.round(Math.random()) ? 'row' : 'col';
        const i = Math.floor(Math.random() * size);
        const j = Math.floor(Math.random() * size);
        let rows = [];
        let cols = [];
        let blockedCells = [];

        if (direction === 'row') {
            A = A.set(i).to(0);
            A = matrix(A).set(j).to(0);

            rows.push(i);
            if (i !== j) {
                rows.push(j);
            }

            rows.forEach(nRow => {
                for (let nCol = 0; nCol < size; nCol++) {
                    blockedCells.push([nRow, nCol]);
                }
            });
        } else {
            A = A.set([], i).to(0);
            A = matrix(A).set([], j).to(0);

            cols.push(i);
            if (i !== j) {
                cols.push(j);
            }

            cols.forEach(nCol => {
                for (let nRow = 0; nRow < size; nRow++) {
                    blockedCells.push([nRow, nCol]);
                }
            });
        }

        this.#boardMatrix = matrix(A);

        return blockedCells;
    }
}