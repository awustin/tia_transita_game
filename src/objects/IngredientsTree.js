import {
    selectByIds,
    selectByMaxValue,
    groupBy,
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

    // Current developed tree
    #current = {
        [NATURAL]: {
            id: NATURAL,
            leaf: {},
            probability: 1/3,
            // Paths config for the ingredients tree evolution
            path: [],
        },
        [AMULET]: {
            id: AMULET,
            leaf: {},
            probability: 1/3,
            path: [],
        },
        [WITCHCRAFT]: {
            id: WITCHCRAFT,
            leaf: {},
            probability: 1/3,
            path: [],
        },
    };

    // There has been a check after 20 moves but it failed
    #lastLevelUpFailed = false;

    // Weighted ratio magic / natural
    #levelUpProbability = 0;

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

        this.#current[NATURAL].leaf = selectByMaxValue(groupedByBranch[String(NATURAL)], 'id');
        this.#current[NATURAL].path = naturalBranch.ingredients;

        this.#current[AMULET].leaf = selectByMaxValue(groupedByBranch[String(AMULET)], 'id');
        this.#current[AMULET].path = amuletBranch.ingredients;

        this.#current[WITCHCRAFT].leaf = selectByMaxValue(groupedByBranch[String(WITCHCRAFT)], 'id');
        this.#current[WITCHCRAFT].path = witchcraftBranch.ingredients;
    }

    /**
     * Updates probabilities for deciding if picking a new ingredient and for what type
     */
    updateProbabilites(points = {}) {
        /* 
            levelUpProbability is based on the ratio of magical points / total points

                                        MAGIC_COEFF . (astrology + necromancy)
            P(increase) ∝ ------------------------------------------------------------------
                            MAGIC_COEFF . (astology + necromancy) + NATURAL_COEFF . labour
        */
        const { compute: { levelUpProbability } } = treeMechanics;
        const {
            labour,
            astrology,
            necromancy,
        } = points;

        this.#levelUpProbability = levelUpProbability(labour, astrology, necromancy);
    };

    /**
     * Checks if there's a new ingredient coming up based on amounts, ingredient family, and scoring
     * @returns Boolean
     */
    isBranchLevelUp(moves) {
        const { constants: {
            MOVES_CHECK,
            MOVES_LEVEL_UP_FAILED,
        } } = treeMechanics;

        // Every given number of moves, check if there's a new ingredient coming up
        // If false, check every other given number of moves until true
        if (
            (moves > 0 && !(moves % MOVES_CHECK)) ||
            (this.#lastLevelUpFailed && !(moves % MOVES_LEVEL_UP_FAILED))
        ) {
            const result = Math.random() <= this.#levelUpProbability;
            this.#lastLevelUpFailed = !result;

            return result;
        }

        return false;
    }

    /**
     * Gets a new ingredient
     * @param {Object} amounts Amounts by historical ingredient ID
     * @returns Ingredient ID
     */
    levelUpBranch(amounts = {}) {
        /*
            branchProbability is based on the amounts of each type of ingredient

                           ____________________         yi            
            amount i ==>  |  transformation i  | ==> -------- ==> final probability
                           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾         ∑ y
        */
        const { compute: { branchProbabilities } } = treeMechanics;

        // Sum up the ingredients of each branch and pass them to the transform function
        const {
            natural,
            amulet,
            witchcraft,
        } = branchProbabilities(
            this.#sumUpAmounts(this.#current[NATURAL].path, amounts),
            this.#sumUpAmounts(this.#current[AMULET].path, amounts),
            this.#sumUpAmounts(this.#current[WITCHCRAFT].path, amounts)
        );

        this.#current[NATURAL].probability = natural;
        this.#current[AMULET].probability = amulet;
        this.#current[WITCHCRAFT].probability = witchcraft;

        const { path, leaf } = this.#current[this.#pickBranchWithProbability()];

        if (path) {
            // The leaf of the tree is an ingredient currently in the board
            console.log('leaf', leaf);

            const currIndex = path.findIndex(id => Number(id) === Number(leaf.id));

            // Return the nex ingredient ID. If no ingredient, return false
            if (path[currIndex + 1]) {
                console.log('Next ingredient', path[currIndex + 1]);
                return path[currIndex + 1];
            }

            return false;
        }
    }

    get lastLevelUpFailed() {
        return this.#lastLevelUpFailed;
    }

    //----
    // Private
    //----

    #sumUpAmounts(idArray, idAmountMap) {
        return idArray.reduce((acc, id) => {
            if (idAmountMap[id] == null) {
                return acc;
            }

            return acc = acc + idAmountMap[id];
        }, 0);
    }

    #pickBranchWithProbability() {
        const target = Math.random();

        const { segments } = [
            { id: NATURAL, prob: this.#current[NATURAL].probability },
            { id: AMULET, prob: this.#current[AMULET].probability },
            { id: WITCHCRAFT, prob: this.#current[WITCHCRAFT].probability }
        ].sort(({ prob: probA }, { prob: probB }) => probB - probA)
        .reduce((acc, current, index) => {
            acc.probability += current.prob;

            if (!index) {
                acc.segments = [current];
            } else {
                acc.segments = [
                    ...acc.segments,
                    {
                        ...current,
                        prob: acc.probability,
                    }
                ]
            }

            return acc;
        }, {
            probability: 0,
            segments: [],
        });

        return (segments.find(({ prob }) => target <= prob) || {})[id];
    }
}