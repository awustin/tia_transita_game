import {
    select,
    selectById,
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
    #config = null;
    #results = {
        labour: 0,
        astrology: 0,
        necromancy: 0
    };

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
                code: 'C07'
            };
        }

        const { initIngredientsIds } = select(boards.items, board => board.default)[0];

        initIngredientsIds.forEach(id => {
            this.#amounts[Number(id)] = 0;
            this.#currentIngredients[Number(id)] = selectById(ingredients.items, id);
        });
        console.log({ a: this.#amounts, b: this.#currentIngredients})
    }

    /**
     * Add a config key.
     * @param {*} id Ingredient type id
     * @param {*} values Values `{<labour>, <necromancy>, <astrology>}`
     */
    addIngredientConfig(id, values = {}) {
        const {
            labour = null,
            necromancy = null,
            astrology = null
        } = values;

        if (!labour || !necromancy || !astrology) {
            throw {
                message: 'Invalid config for ingredient',
                code: 'C08'
            }
        }

        this.#config[id] = { labour, necromancy, astrology };
    }

    /**
     * Add move to results.
     * @param {Number} id Ingredient type id
     * @param {Number} amount Number of ingredients in the move
     */
    add(id, amount) {
        const currAmount = this.#amounts[Number(id)] || 0;
        const weightedAmount = this.#weightedMove(amount);
        const { labour, necromancy, astrology } =  this.#config[id];

        this.#amounts[Number(id)] = currAmount + amount;
        this.#labour = this.#labour + labour * weightedAmount;
        this.#necromancy = this.#necromancy + necromancy * weightedAmount;
        this.#astrology = this.#astrology + astrology * weightedAmount;

        this.#setRegistryResults();
    }

    /**
     * Retrieves accumulated results
     */
    get results() {
        return this.#results;
    }

    get config() {
        return this.#config;
    }

    get amounts() {
        return this.#amounts;
    }

    // Private

    /**
     * The more ingredients in one move, the more influence in the results.
     * Uses a factor that indicates the relation between the amount and the weight in the results
     */
    #weightedMove(amount) {
        return amount * amount;
    }

    #setRegistryResults() {
        this.#results.labour = this.#labour;
        this.#results.necromancy = this.#necromancy;
        this.#results.astrology = this.#astrology;
    }
}
