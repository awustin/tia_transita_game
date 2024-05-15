/**
 * Contains information of the selected Ingredients
 */
export default class IngredientsBasket
{
    #scene = null
    #selected = [];
    #combinationTypeId = null;

    constructor(scene = null) {
        if(!scene) {
            throw {
                message: 'IngredientsBasket missing scene',
                code: 'C12'
            }
        }

        this.#scene = scene;
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

        return this.#selected.splice(index);
    }

    /**
     * Sets the flag for collecting ingredients at scene.registry.collectAvailable
     * if the length of selected is greater or equal than 2
     * @param {Boolean} value 
     */
    setCollectAvailable() {
        const selected = this.#selected;

        if (selected.length < 2) {
            this.#scene.registry.collectAvailable = false;
        } else {
            this.#scene.registry.collectAvailable = true;
        }
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
