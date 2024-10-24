import {
    selectById,
    selectByValue,
} from "@utils/data";

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
    #weightedMove = Function.prototype;

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

        const {
            score: {
                add: { weightedMove }
            }
        } = this.game.cache.json.get('calibration');

        if (!weightedMove) {
            throw {
                message: 'ScorePlugin: missing entity "score: { add: { weightedMove } } " in calibration config',
                code: 'C08'
            };
        }

        this.#weightedMove = new Function(weightedMove.args, weightedMove.body);
        this.updateCurrentIngredients(
            selectByValue(boards.items, 'default')?.initIngredientsIds
        );
    }

    /**
     * Updates the current list of ingredients and amounts.
     * @param {Array} newIds Array of updated ingredient ids
     */
    updateCurrentIngredients(newIds = []) {
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
        const currAmount = this.#amounts[Number(id)] || 0;
        const { labour, necromancy, astrology } =  this.#currentIngredients[id] || {};

        if (typeof labour !== 'undefined' &&
            typeof necromancy !== 'undefined' &&
            typeof astrology !== 'undefined'
        ) {
            this.#amounts[Number(id)] = currAmount + amount;
            this.#labour = this.#labour + this.#weightedMove(amount, labour);
            this.#necromancy = this.#necromancy + this.#weightedMove(amount, necromancy);
            this.#astrology = this.#astrology + this.#weightedMove(amount, astrology);
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
