/**
 * Contains information of the selected Ingredients
 */
export default class IngredientsBasket
{
    #selected = [];
    #combinationTypeId = null;

    constructor(scene = null) {
        if(!scene) {
            throw {
                message: 'IngredientsBasket missing scene',
                code: 'C12'
            }
        }
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
     */
    addSelectedIngredient(ingredient = null) {
        const selected = this.#selected;

        if (!selected.length) {
            selected.push(ingredient);
            this.#combinationTypeId = ingredient.typeId;

            return true;
        }

        if (!this.#isCombinationType(ingredient) || !this.#isAdjacent(ingredient)) {
            return false;
        }

        selected.push(ingredient);

        if (selected.length >= 2) {
            // Emit collect available
        }

        return true;        
    }

    /**
     * Breaks the chain of selected ingredients
     * @param {Object} ingredient
     * @returns {Array} Array of removed items
     */
    removeSelectedIngredients(index = -1) {
        if (index < 0 || this.#selected.length - 1 < index) {
            return false;
        }

        return this.#selected.splice(index + 1);
    }

    get selected() {
        return this.#selected;
    }

    // Private

    #isCombinationType(ingredient) {
        return Number(ingredient.typeId) === Number(this.#combinationTypeId);
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
