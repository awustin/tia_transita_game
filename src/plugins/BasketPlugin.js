import { spell as spellMechanics } from "@utils/mechanics";

export default class BasketPlugin extends Phaser.Plugins.BasePlugin
{
    #selected = [];
    #combinationTypeId = null;
    #collectAvailable = false;

    constructor(pluginManager) {
        if(!pluginManager) {
            throw {
                message: 'BasketPlugin missing argument',
                code: 'C12'
            }
        }
        super(pluginManager);
    }

    stop() {
        this.#selected = [];
        this.#combinationTypeId = null;
        this.#collectAvailable = false;
    }

    /**
     * Returns index of selected ingredient. -1 if not found.
     * @param {Object} ingredient
     */
    selectedIndex(ingredient = null) {
        return this.#selected.findIndex(item =>
            ingredient.cell[0] === item.cell[0] && ingredient.cell[1] === item.cell[1]
        );
    }

    /**
     * Adds an ingredient to the selected array
     * @param {Ingredient} ingredient
     * @returns Boolean with the result of operation
     */
    trackIngredient(ingredient = null) {
        const selected = this.#selected;

        if (!selected.length) {
            selected.push(ingredient);
            this.#combinationTypeId = ingredient.id;

            return true;
        }

        if (!this.#isCombinationType(ingredient) || !this.#isAdjacent(ingredient)) {
            return false;
        }

        selected.push(ingredient);

        return true;        
    }

    /**
     * Breaks the chain of selected ingredients
     * @param {Object} ingredient
     * @returns {Array} Array of removed items
     */
    untrackSelectedIngredients(index = -1) {
        if (index < 0 || this.#selected.length - 1 < index) {
            return false;
        }

        return this.#selected.splice(index);
    }

    /**
     * Checks if the selected ingredients are ready to collect
     * @param {Boolean} withMinMoves Flag that indicates if the spell `minMoves` is active
     * @returns {Boolean} Boolean
     */
    checkCollectEnabled(withMinMoves = false) {
        const { constants: { MIN_MOVES }} = spellMechanics;
        const { selected } = this;
        const minMovesThreshold = withMinMoves ? selected.length >= MIN_MOVES : true;

        if (selected.length >= 2 && minMovesThreshold) {
            return true;
        }

        return false;
    }
    

    get selected() {
        return this.#selected;
    }

    get collectAvailable() {
        return this.#collectAvailable;
    }

    set collectAvailable(value) {
        if (value && !this.#collectAvailable) {
            this.#collectAvailable = value;
        }

        if (!value && this.#collectAvailable) {
            this.#collectAvailable = value;
        }
    }

    // Private

    #isCombinationType(ingredient) {
        return Number(ingredient.id) === Number(this.#combinationTypeId);
    }

    #isAdjacent(ingredient) {
        const lastCell = this.#selected[this.#selected.length - 1].cell;
        const cell = ingredient.cell;

        // Row adjacent
        if (cell[0] == lastCell[0]) {
            return Math.abs(cell[1] - lastCell[1]) === 1;
        }

        // Column adjacent
        if (cell[1] == lastCell[1]) {
            return Math.abs(cell[0] - lastCell[0]) === 1;
        }

        return false;
    }
}