import Ingredient from '@sprites/Ingredient';
import {
    GRID_COUNT,
    GRID_X,
    GRID_Y,
    CELL_SIZE_PX
} from "@constants";

/**
 * Create a square grid of ingredients
 * @extends Phaser.GameObjects.Group
 * @param {*} scene This scene
 * @param {*} size Size of the grid. If not set it defaults to 9
 */
export default class IngredientsGameGrid extends Phaser.GameObjects.Group
{
    #group = null;
    #grid = [];
    #emptyPositions = [];
    supply = null;

    constructor(scene = null, size = GRID_COUNT) {
        if (!scene) {
            throw {
                message: 'IngredientsGameGrid missing scene',
                code: 'C10'
            }
        }

        super(scene);
        this.supply = scene.plugins.get('supply');

        if (!this.supply) {
            throw {
                message: 'IngredientsGameGrid: add SupplyPlugin to game',
                code: 'C11'
            }
        }

        this.#group = scene.add.group();
        this.#group.setName('ingredientsGrid');

        for (let row = 0; row < size; row++) {
            let columnArray = [];

            for (let col = 0; col < size; col++) {
                const ingredient = this.#newIngredientAtPosition(row, col);
                columnArray.push(ingredient);
            }

            this.#grid.push(columnArray);
        }
    }

    /**
     * Replaces the cell with a temporary empty value for the ingredient sent,
     * and tracks the replaced index
     * @param {Object} ingredient
     * @returns Array of index `[row, col]`
     */
    replaceWithEmpty(ingredient = null) {
        let position = null;

        if (ingredient) {
            const [ row, col ] = ingredient.cell;
            position = [row, col];

            this.#grid[row][col] = 'empty';
            this.#emptyPositions.push(position);
        }

        return position;
    }

    /**
     * Places a new ingredient in the empty positions, and untracks the empty cell
     * @param {Number} typeId The type if of the ingredient
     * @param {Number} row index
     * @param {Number} col index
     */
    fillInWithNewIngredients() {
        if (this.#emptyPositions.length) {
            this.#emptyPositions.forEach(([row, col]) => {
                this.#grid[row][col] = this.#newIngredientAtPosition(row, col);
            });
        }

        this.#emptyPositions.splice(0);
    }

    get emptyPositions() {
        return this.#emptyPositions;
    }

    // Private

    #newIngredientAtPosition(row, col) {
        const ingredient = new Ingredient(
            this.supply.getNextIngredients()[0].id,
            [row, col],
            {
                scene: this.scene,
                x: GRID_X + CELL_SIZE_PX * col,
                y: GRID_Y + CELL_SIZE_PX * row,
            }
        );
        this.#group.add(ingredient);

        return ingredient;
    }
}