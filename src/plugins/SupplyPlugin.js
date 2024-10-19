export default class SupplyPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #sortedIngredientsWithProbability = [];
    #sortedProbabilitySegments = [];
 
    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
    }

    init(probabilities) {
        if (!probabilities) {
            throw {
                message: 'SuplliesPlugin: empty probabilities list',
                code: 'C01'
            };
        } else if (!probabilities.length == 4) {
            throw {
                message: 'SuppliesPlugin: probabilities list should be 4',
                code: 'C02'
            };
        }

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
     * The ingredient with the higher probability gets discarted.
     * It recalculates the probabilities to distribute them evenly.
     * @param {*} newIngredient
     * @returns Discarded ingredient
     */
    addIngredient(newIngredient = {}) {
        const ingredients = this.#sortedIngredientsWithProbability;
        const mostLikelyIngredient = ingredients.reduce((acc, curr, index) => {
            if (!index || (curr.probability >= acc?.probability))
                return curr;
        }, {});
        const restockedIngredients = ingredients.filter(({ id }) => Number(id) !== Number(mostLikelyIngredient.id))
        
        restockedIngredients.push(newIngredient);
        
        this.#updatePool(restockedIngredients.map(ingredient => ({ ...ingredient, probability: 1/4 })));

        return mostLikelyIngredient;
    }

    /**
     * Redistributes the probability of each ingredient
     * based on the amount of each type passed. The higher the amount, the lower the probability
     * @param {Object} ingredientsAmount Object with ids as keys and amounts as values
     * `{ ... <id>: <amount> }`
     */
    redistributeProbabilities(ingredientsAmount = {}) {
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