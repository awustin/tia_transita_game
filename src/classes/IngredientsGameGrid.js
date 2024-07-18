import Ingredient from './Ingredient';

/**
 * Extends Phaser GameObjects.Group to create a set of ingredients
 */
export default class IngredientsGameGrid extends Phaser.GameObjects.Group
{
    #group = null;
    #ingredientsPool = null;
    #grid = [];
    #emptyPositions = [];
    #config = null;

    /**
     * Create a square grid of ingredients 
     * @param {*} config config needed for Phaser.GameObjects.Group
     * @param {*} size Size of the grid. If not set it defaults to 8
     */
    constructor(config = null, size = 8) {
        if (!config || !config.scene) {
            throw {
                message: 'IngredientsGameGrid missing config or config.scene',
                code: 'C10'
            }
        }
        if (typeof config.scene?.add?.ingredientsPool === 'undefined') {
            throw {
                message: 'IngredientsGameGrid: add ingredientsPool to scene.add',
                code: 'C11'
            }
        }
        super(config.scene, config);

        this.#config = config;
        this.#group = config.scene.add.group();
        this.#group.setName('ingredientsOrchard');
        this.#ingredientsPool = config.scene.add.ingredientsPool;

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
            this.#ingredientsPool.getNextIngredients()[0].id,
            [row, col],
            {
                scene: this.#config.scene,
                x: this.#config.offsetX / 1.79 + 64 * col + Math.floor(Math.random() * 2),
                y: this.#config.offsetY / 2.65 + 64 * row + Math.floor(Math.random() * 2),
            }
        );
        this.#group.add(ingredient);

        return ingredient;
    }
}