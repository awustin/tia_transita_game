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
export default class IngredientsGrid extends Phaser.GameObjects.Group
{
    #group = null;
    #grid = [];
    #emptyPositions = [];

    constructor(scene = null, size = GRID_COUNT) {
        if (!scene) {
            throw {
                message: 'IngredientsGrid missing scene',
                code: 'C10'
            }
        }

        super(scene);

        if (!scene.plugins.get('supply')) {
            throw {
                message: 'IngredientsGrid: add SupplyPlugin to game',
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
     * Replaces a cell with a temporary empty value for the ingredient sent,
     * and tracks the voided position
     * @param {Object} ingredient
     * @returns Array of index `[row, col]`
     */
    voidSingleIngredient(ingredient = null) {
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
     * Replaces cells with a temporary empty value for the id sent,
     * and tracks the voided positions.
     * @param {Any} id Ingredient id or ingredient ids array to void
     * @return 2D array: `[ ... [row_i, col_i] ... ]`
     */
    voidByIngredientId(id = null) {
        let positions = [];

        const equalOperation = compareTo => {
            if (typeof id === 'number' || typeof id === 'string') {
                return Number(compareTo) === Number(id);
            }

            return id.includes(Number(compareTo));
        }

        if (id) {
            const grid = this.#grid;

            grid.forEach(row => {
                row.forEach(ingredient => {
                    if (equalOperation(ingredient.id)) {
                        const [row, col] = ingredient.cell;

                        ingredient.setCollected();
                        positions.push([row, col]);
                        this.#grid[row][col] = 'empty';
                    }
                })
            });
            this.#emptyPositions.push(...positions);

            return positions;
        }

        return [];
    }

    /**
     * Places a new ingredient in the empty positions, and untracks the empty cell
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

    get array() {
        return this.#grid;
    }

    // Private

    #newIngredientAtPosition(row, col) {
        const supply = this.scene.plugins.get('supply');

        const ingredient = new Ingredient(
            supply.getNextIngredients()[0].id,
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