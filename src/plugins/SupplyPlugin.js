import {
    select,
    selectByIds,
} from "@utils/data";

export default class SupplyPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #sortedIngredientsWithProbability = [];
    #sortedProbabilitySegments = [];
 
    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
    }

    init() {
        const {
            boards,
            ingredients,
        } = this.game.cache.json.get('game');

        if (!boards) {
            throw {
                message: 'SuplliesPlugin: missing entity "boards" in game config',
                code: 'C01'
            };
        }

        const { initIngredientsIds } = select(boards.items, board => board.default)[0];
        
        if (!initIngredientsIds.length == 4) {
            throw {
                message: 'SuppliesPlugin: board ingredients list should be 4',
                code: 'C02'
            };
        }

        const initIngredients = selectByIds(ingredients.items, initIngredientsIds);
        const max = initIngredients.reduce((sum, { relativeProbability }) => sum = sum + relativeProbability, 0);
        const probabilities = initIngredients.map(({ id, relativeProbability }) => ({ id, probability: relativeProbability / max }));

        this.#updatePool(probabilities);
    }

    /**
     * Gets an array of ingredients based on each probability
     * @param {Number} amount If not specified, it returns a single ingredient
     * @returns List of ingredients
     */
    getNextIngredients(amount = 1) {
        return new Array(amount)
            .fill(null)
            .map(() => this.#pickIngredientWithProbability());
    }

    /**
     * Adds an ingredient to the pool. It always keeps 4 ingredients.
     * The second parameter specifies the ingredient to remove.
     * It recalculates the probabilities to distribute them evenly.
     * @param {Number} addId
     * @param {Number} removeId
     * @returns Boolean
     */
    addIngredient(addId = null, removeId = null) {
        const ingredients = this.#sortedIngredientsWithProbability;

        const removeIndex = ingredients.findIndex(({ id }) => Number(id) === Number(removeId));

        if (removeIndex >= 0) {
            ingredients[removeIndex] = { id: addId };
            this.#updatePool(ingredients.map(ingredient => ({ ...ingredient, probability: 1/4 })));

            return true;
        }

        return false;
    }

    /**
     * Redistributes the probability of each ingredient
     * based on the amount of each type passed. The higher the amount, the lower the probability
     * @param {Object} ingredientsAmount Object with ids as keys and amounts as values
     * `{ ... <id>: <amount> }`
     */
    updateProbabilities(ingredientsAmount = {}) {
        if (Object.keys(ingredientsAmount).length) {
            const sortedIngredients = this.#sortedIngredientsWithProbability;
            let max = 0;
            let totalInversed = 0;
            const inversedAmounts = {};

            // Filter the ids present in the pool
            const filteredIngredientsIds = Object.keys(ingredientsAmount)
                .filter(id =>
                    sortedIngredients.find(ingredient => Number(id) === Number(ingredient.id))
                );

            // Get the max amount
            max = Math.max(...filteredIngredientsIds.map(id => ingredientsAmount[id]));

            // Inverse amounts to compute probabilities
            filteredIngredientsIds.forEach(id => {
                const amount = ingredientsAmount[id];
                const inverse = 2 * max - amount;

                inversedAmounts[id] = inverse;
                totalInversed += inverse;
            });

            this.#updatePool(sortedIngredients.map(ingredient => ({
                ...ingredient,
                probability: inversedAmounts[ingredient.id] / totalInversed,
            })));
        }
    }

    get currentIngredients() {
        return this.#sortedIngredientsWithProbability;
    }

    // Private functions

    #updatePool(list) {
        this.#sortedIngredientsWithProbability = this.#setSortedIngredients(list);
        this.#sortedProbabilitySegments = this.#updateProbabilitySegments();
    }

    #setSortedIngredients(list) {
        return list.sort((a, b) => Number(a.probability) - Number(b.probability));
    }

    #updateProbabilitySegments() {
        const sortedIngredients = this.#sortedIngredientsWithProbability;

        // Accumulated probabilities: [0.34, 0.33, 0.33] => [0.34, 0.67, 1]
        return sortedIngredients.reduce((acc, curr, index) => {
            const { id, probability } = curr;

            if (!index) {
                acc.push({ id, probability });
            } else {
                const lastProbability = acc[index - 1].probability;

                acc.push({ id, probability: lastProbability + probability })
            }

            return acc;
        }, []);
    }

    #pickIngredientWithProbability() {
        const ingredients = this.#sortedIngredientsWithProbability;
        const sortedProbabilitySegments = this.#sortedProbabilitySegments;
        const target = Math.random();
        const picked = sortedProbabilitySegments.find(upperBound => target <= upperBound.probability);

        return ingredients.find(({ id }) => Number(picked.id) === Number(id));
    }
}