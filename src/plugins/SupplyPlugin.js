import { tree as treeMechanics } from "@utils/mechanics";
import {
    select,
    selectByIds,
} from "@utils/data";

const NATURAL = 300;
const AMULET = 301;
const WITCHCRAFT = 302;

export default class SupplyPlugin extends Phaser.Plugins.BasePlugin
{
    #sortedIngredientsWithProbability = [];
    #sortedProbabilitySegments = [];

    // Each place holds a specific branch. The fourth place is reserved for discarded ingredients
    #slots = {
        [NATURAL]: null,
        [AMULET]: null,
        [WITCHCRAFT]: null,
        extra: null,
    };

    // Discarded ingredients will be picked randomly as a fourth ingredient in the board
    #discard = [];
 
    constructor(pluginManager) {
        super(pluginManager);
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

        this.#slots.extra = initIngredientsIds[0];
        this.#slots[AMULET] = initIngredientsIds[1];
        this.#slots[WITCHCRAFT] = initIngredientsIds[2];
        this.#slots[NATURAL] = initIngredientsIds[3];
        this.#discard.push(initIngredientsIds[0]);

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
     * Checks if the extra ingredient should be replaced
     * @param {Number} moves Number of moves in the game
     * @returns Boolean
     */
    isReplaceExtraIngredient(moves = null) {
        const { constants: { MOVES_SWAP_EXTRA } } = treeMechanics;

        if (!(moves % MOVES_SWAP_EXTRA)) {
            return Math.random() < 0.4;
        }
    }

    /**
     * Updates ingredients in the pool. It always keeps 4 ingredients.
     * It recalculates the probabilities to distribute them evenly.
     * @param {Number} newSlots in the format `{ [NATURAL]: <id>, [AMULET]: <id>, [WITCHCRAFT]: <id> }`
     */
    updateIngredientsSlots(newSlots = {}) {
        Object.keys(newSlots).forEach(branchId => { 
            if (Number(this.#slots[String(branchId)]) !== Number(newSlots[branchId])) {
                this.#discard.push(this.#slots[String(branchId)]);

                this.#slots[String(branchId)] = newSlots[branchId];
            }
        });

        const probabilities = Object.values(this.#slots).map(id => ({ id, probability: 1/4 }));
        this.#updatePool(probabilities);

        return true;
    }

    /**
     * Replaces the current extra ingredient with one of the discarded
     * and returns the new ID.
     * @returns New ID
     */
    updateExtraIngredient() {
        const discard = this.#discard;
        const randomExtra = discard[Math.floor(Math.random() * discard.length)];
        const oldId = this.#slots.extra;

        if (!Object.values(this.#slots).includes(randomExtra)) {
            this.#slots.extra = randomExtra;

            const probabilities = Object.values(this.#slots).map(id => ({ id, probability: 1/4 }));
            this.#updatePool(probabilities);
    
            return oldId;
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

    get slots() {
        return this.#slots;
    }

    get discard() {
        return this.#discard;
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