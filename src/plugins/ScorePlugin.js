import {
    selectById,
    selectByValue,
} from "@utils/data";
import { score as scoreMechanics } from "@utils/mechanics";

/**
 * Keeps track of the accumulated results, based on the amount of each type of ingredient.
 * Results are stored as `{ ... <id>: <amount> }`.
 * @param {*} config Indicates the labour, astrology and necromancy attributes for each ingredient type, in
 * the format `{ <id>: { labour: <labour>, astrology: <astrology>, necromancy: <necromancy>} }`
 */
export default class ScorePlugin extends Phaser.Plugins.BasePlugin
{
    #amounts = {};
    #labour = 0;
    #necromancy = 0;
    #astrology = 0;
    #currentIngredients = {};

    constructor(pluginManager) {
        if(!pluginManager) {
            throw {
                message: 'ScorePlugin missing argument',
                code: 'C07'
            }
        }

        super(pluginManager);
    }

    init() {
        const {
            boards,
            ingredients,
        } = this.game.cache.json.get('game');

        if (!ingredients || !boards) {
            throw {
                message: 'ScorePlugin: missing entity "ingredients" and "boards" in game config',
                code: 'C08'
            };
        }

        this.initCurrentIngredients(selectByValue(boards.items, 'default')?.initIngredientsIds);
    }

    /**
     * Initializes the current list of ingredients and amounts.
     * @param {Array} newIds Array of updated ingredient ids
     */
    initCurrentIngredients(newIds = []) {
        const { ingredients } = this.game.cache.json.get('game');

        this.#currentIngredients = {};

        newIds.forEach(id => {
            if (!this.#amounts[Number(id)]) {
                this.#amounts[Number(id)] = 0;
            }

            this.#currentIngredients[Number(id)] = selectById(ingredients.items, id) || {};
        });
    }

    /**
     * Adds an ingredient to current list and to amounts.
     * @param {Number} addId New ingredient id
     * @param {Number} removeId Id to remove
     */
    addCurrentIngredient(addId = [], removeId = null) {
        const { ingredients } = this.game.cache.json.get('game');
        const ingredient = selectById(ingredients.items, addId);

        if (ingredient && removeId) {
            this.#currentIngredients[Number(addId)] = ingredient;
    
            if (removeId) {
                delete this.#currentIngredients[Number(removeId)];
            }

            if (!this.#amounts[Number(addId)]) {
                this.#amounts[Number(addId)] = 0;
            }
        }
    }

    /**
     * Adds an ingredient to the current ingredients, and removes the one specified.
     * @param {Number} id New ingredient id
     * @param {Number} removeId Ingredient to replace
     */
    replaceIngredient(id, removeId) {
        if(!id || !removeId) {
            return false;
        }

        const current = Object.keys(this.#currentIngredients);
        const index = current.indexOf(String(removeId));

        if (index !== -1) {
            current[index] = id;
            this.updateCurrentIngredients(current);
        }
    }

    /**
     * Add move to results.
     * @param {Number} id Ingredient type id
     * @param {Number} amount Number of ingredients in the move
     */
    add(id, amount) {
        const { compute: { weightedMove } } = scoreMechanics;
        const currAmount = this.#amounts[Number(id)] || 0;
        const { labour, necromancy, astrology } =  this.#currentIngredients[id] || {};

        if (typeof labour !== 'undefined' &&
            typeof necromancy !== 'undefined' &&
            typeof astrology !== 'undefined'
        ) {
            this.#amounts[Number(id)] = currAmount + amount;
            this.#labour = this.#labour + weightedMove(amount, labour);
            this.#necromancy = this.#necromancy + weightedMove(amount, necromancy);
            this.#astrology = this.#astrology + weightedMove(amount, astrology);
        }
    }

    /**
     * Retrieves accumulated results
     */
    get points() {
        return ({
            astrology: this.#astrology,
            necromancy: this.#necromancy,
            labour: this.#labour
        });
    }

    get currentIngredients() {
        return this.#currentIngredients;
    }

    get amounts() {
        return this.#amounts;
    }
}
