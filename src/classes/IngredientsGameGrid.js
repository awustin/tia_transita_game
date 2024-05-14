import Ingredient from './Ingredient';

/**
 * Extends Phaser GameObjects.Group to create a set of ingredients
 */
export default class IngredientsGameGrid extends Phaser.GameObjects.Group
{
    #group = null;
    #ingredientsPool = null;

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
                message: 'Add ingredientsPool to scene.add',
                code: 'C11'
            }
        }
        super(config.scene, config);

        this.#group = config.scene.add.group();
        this.#group.setName('ingredientsOrchard');
        this.#ingredientsPool = config.scene.add.ingredientsPool;

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const ingredient = new Ingredient(
                    this.#ingredientsPool.getNextIngredients()[0].id,
                    [row, col],
                    {
                        scene: config.scene,
                        x: 200 + 50*row,
                        y: 100 + 50*col,
                    }
                ); 
                this.#group.add(ingredient);
            }
        }
    }
}