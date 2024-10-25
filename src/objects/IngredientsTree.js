import {
    selectByIds,
    selectByMaxValue,
    groupBy,
    aggregate,
} from "@utils/data";
import { tree as treeMechanics } from "@utils/mechanics";

const NATURAL = 300;
const AMULET = 301;
const WITCHCRAFT = 302;

/**
 * New ingredients should be calculated based on amounts, ingredient family, and scoring
 */
export default class IngredientsTree
{
    #scene = null;

    #natural = [];

    #amulet = [];

    #witchcraft = [];

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
    #isNew = false;

    // Weighted ratio magic / natural
    #increaseBranchProbability = 0;

    // Amounts of each type of ingredients
    #branchProbability = 0;

    constructor(scene) {
        if (!scene) {
            throw {
                message: 'IngredientsTree missing scene',
                code: 'C19'
            }
        }

        if (!scene.cache.json.get('game')) {
            throw {
                message: 'IngredientsTree missing a game config object. Check it\'s being loaded in Intro scene',
                code: 'C20'
            }
        }

        this.#scene = scene;
        this.initializeTree();
    }

    /**
     * Updates probabilities for deciding if picking a new ingredient and for what type
     */
    updateProbabilites(points = {}) {
        /* 
            increaseBranchProbability is based on the ratio of magical points / total points

                                            DECIDE_MAGIC_POINTS_COEFF . (astrology + necromancy)
            P(increase) ∝ --------------------------------------------------------------------------------------------------
                            DECIDE_MAGIC_POINTS_COEFF . (astology + necromancy) + DECIDE_NATURAL_POINTS_COEFF . labour
        */
        const {
            constants: {
                DECIDE_MAGIC_POINTS_COEFF,
                DECIDE_NATURAL_POINTS_COEFF,
            }
        } = treeMechanics;
        const {
            labour,
            astrology,
            necromancy,
        } = points;

        if ((astrology + necromancy + labour) > 0) {
            this.#increaseBranchProbability = DECIDE_MAGIC_POINTS_COEFF * (astrology + necromancy) /
                (DECIDE_MAGIC_POINTS_COEFF * (astrology + necromancy) + DECIDE_NATURAL_POINTS_COEFF * labour);
        }
    };

    /**
     * Checks if there's a new ingredient coming up based on amounts, ingredient family, and scoring
     * @returns Boolean
     */
    isBranchIncrease(moves) {
        const { constants: { MOVES_CHECK } } = treeMechanics;

        // Every given number of moves, check if there's a new ingredient coming up
        if (moves && (moves !== 0) && !(moves % MOVES_CHECK)) {
            return Math.random() <= this.#increaseBranchProbability;
        }

        return false;
    }

    /**
     * Initializes the current tree with the last ingredients added
     */
    initializeTree() {
        const {
            ingredients,
            branches,
        } = this.#scene.cache.json.get('game');
        const supply = this.#scene.plugins.get('supply');
        const [naturalBranch, amuletBranch, witchcraftBranch] = selectByIds(branches.items, [NATURAL, AMULET, WITCHCRAFT]);

        const groupedByBranch = groupBy(
            selectByIds(
                ingredients.items,
                supply.currentIngredients.map(({ id }) => Number(id))
            ),
            'branchId'
        );

        this.#current.natural.leaf = selectByMaxValue(groupedByBranch[String(NATURAL)], 'id');
        this.#natural = naturalBranch;
        this.#current.amulet.leaf = selectByMaxValue(groupedByBranch[String(AMULET)], 'id');
        this.#amulet = amuletBranch;
        this.#current.witchcraft.leaf = selectByMaxValue(groupedByBranch[String(WITCHCRAFT)], 'id');
        this.#witchcraft = witchcraftBranch;
    }

    /**
     * Gets a new ingredient
     * @param {Object} amounts Amounts by historical ingredient ID
     * @param {Object} currentIngredients Current ingredients by ID
     * @returns Ingredient ID
     */
    levelUpBranch(amounts = {}, currentIngredients = {}) {
        /*
            branchProbability is based on the amounts of each type of ingredient

                                BRANCH_COEFF . amount
            P(branch) ∝ ---------------------------------------
                                    total amount


            P(branch1)---------yes-------------X
                      |
                      ---------no-------------P(branch2)---------yes-------------X
                                                        |
                                                         ---------no-------------P(branch3)----------yes---------X
        */

        // Sum up ingredients of the NATURAL branch
        const totalNatural = aggregate(this.#natural)
    }

    get isNew() {
        return this.#isNew;
    }

    //----
    // Private
    //----

    #computeBranchIncrease(ingredients = {}, amounts = {}, points = {}) {

    }
}