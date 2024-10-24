import {
    selectByIds,
    selectByMaxValue,
    groupBy,
} from "@utils/data";
import { linear } from "@utils/math";

const NATURAL = 300;
const AMULET = 301;
const WITCHCRAFT = 302;

/**
 * New ingredients should be calculated based on amounts, ingredient family, and scoring
 */
export default class IngredientsTree
{
    #scene = null;

    // Current developed tree
    #current = {
        natural: {
            id: NATURAL,
            leaf: {},
            probability: 1/3,
        },
        amulet: {
            id: AMULET,
            leaf: {},
            probability: 1/3,
        },
        witchcraft: {
            id: WITCHCRAFT,
            leaf: {},
            probability: 1/3,
        },
    };

    // There has been a new ingredient
    #isNew = false

    constructor(scene) {
        if (!scene) {
            throw {
                message: 'IngredientsTree missing scene',
                code: 'C19'
            }
        }

        if (!scene.plugins.get('supply')) {
            throw {
                message: 'IngredientsTree: add SupplyPlugin to game',
                code: 'C20'
            }
        }

        if (!scene.plugins.get('score')) {
            throw {
                message: 'IngredientsTree: add ScorePlugin to game',
                code: 'C21'
            }
        }

        if (!scene.cache.json.get('game')) {
            throw {
                message: 'IngredientsTree missing a game config object. Check it\'s being loaded in Intro scene',
                code: 'C22'
            };
        }

        if (!scene.cache.json.get('calibration')) {
            throw {
                message: 'IngredientsTree missing a calibration config object. Check it\'s being loaded in Intro scene',
                code: 'C23'
            };
        }

        this.#scene = scene;
        this.initializeTree();
    }

    /**
     * Checks if there's a new ingredient coming up based on amounts, ingredient family, and scoring
     * @returns Boolean
     */
    isBranchIncrease(moves) {
        if (moves != null) {
            // Todo: needs calibration
            const score = this.#scene.plugins.get('score');
    
            return this.#decideIfBranchIncrease(score.points, moves);
        }

        return false;
    }

    /**
     * Initializes the current tree with the last ingredients added
     */
    initializeTree() {
        const { ingredients } = this.#scene.cache.json.get('game');
        const supply = this.#scene.plugins.get('supply');

        const groupedByBranch = groupBy(
            selectByIds(
                ingredients.items,
                supply.currentIngredients.map(({ id }) => Number(id))
            ),
            'branchId'
        );

        this.#current.natural.leaf = selectByMaxValue(groupedByBranch[String(NATURAL)], 'id');
        this.#current.amulet.leaf = selectByMaxValue(groupedByBranch[String(AMULET)], 'id');
        this.#current.witchcraft.leaf = selectByMaxValue(groupedByBranch[String(WITCHCRAFT)], 'id');
    }

    get isNew() {
        return this.#isNew;
    }

    //----
    // Private
    //----

    /**
     * Decide if there's a new ingredient coming up based on the current score,
     * on every given amount of moves. The higher the astrology and necromancy points,
     * the higher the chances to get a new ingredient
     * @param {Object} points Current score: `{ astrology, necromancy, labour }`
     * @param {Number} moves Number of moves so far
     * @returns Boolean
     */
    #decideIfBranchIncrease(points = {}, moves = 0) {
        const { tree: {
            MOVES_CHECK,
            ifBranchIncrease: {
                MAGIC_COEFF,
                NATURAL_COEFF,
            }
        } } = this.#scene.cache.json.get('calibration');

        // Every given number of moves, check if there's a new ingredient coming up
        if ((moves !== 0) && !(moves % MOVES_CHECK)) {
            const {
                labour,
                astrology,
                necromancy,
            } = points;

            /* 
                "Yes" probability is based on the ratio of magical points / total points

                                        MAGIC_COEFF . (astrology + necromancy)
                P(Yes) ∝ ------------------------------------------------------------------
                           MAGIC_COEFF . (astology + necromancy) + NATURAL_COEFF . labour
            */

            // Result should be <= 1
            const yesProbability = linear([astrology, necromancy], [MAGIC_COEFF, MAGIC_COEFF]) /
                linear([astrology, necromancy, labour], [MAGIC_COEFF, MAGIC_COEFF, NATURAL_COEFF]);

            return Math.random() <= yesProbability;
        }

        return false;
    }

    #computeBranchIncrease(ingredients = {}, amounts = {}, points = {}) {

    }
}