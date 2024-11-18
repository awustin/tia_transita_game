import { spell as spellMechanics } from "@utils/mechanics";

/**
 * Enable / disable the effects in the game
 */
export default class SpellPlugin extends Phaser.Plugins.BasePlugin
{
    #effects = {
        'blockCells': {id: 1, params: null},
        'minMoves': {id: 2, params: null},
        'changeBoard': {id: 3, params: null},
        'resetBoard': {id: 4, params: null},
    };
    #current = 'none';

    #sortedEffectsProbabilities = [{ name: 'none', probability: 1 }];
    #sortedProbabilitySegments = [];

    constructor(pluginManager) {
        if (!pluginManager) {
            throw {
                message: 'SpellPlugin missing argument',
                code: 'C09'
            };
        }

        super(pluginManager);
    }

    start() {
        this.#sortedProbabilitySegments = this.#updateProbabilitySegments();
    }

    stop() {
        this.#effects = {
            'blockCells': { id: 1, params: null },
            'minMoves': { id: 2, params: null },
            'changeBoard': { id: 3, params: null },
            'resetBoard': { id: 4, params: null },
        };
        this.#current = 'none';    
        this.#sortedEffectsProbabilities = [{ name: 'none', probability: 1 }];
        this.#sortedProbabilitySegments = [];

    }
    
    /**
     * Updates or initialize the probability of each effect based on the accumulated results.
     * Sorts the computed probabilities.
     * @param {*} results Object with the accumulated score `{<labour>, <necromancy>, <astrology>}`
     */
    updateProbabilities(results = {}) {
        const {
            labour = 0,
            necromancy = 0,
            astrology = 0
        } = results;
        const effects = this.#effects;
        let total = 0;
        let probabilitiesArray = [];

        // [ ...{ name: <name>, probability: <probability> } ]
        probabilitiesArray = Object.keys(effects).map(name => {
            const probability = this.#computeEffectProbability(name, { labour, necromancy, astrology });
            total += probability;

            return { name, probability };
        });
        probabilitiesArray.push({ name: 'none', probability: 1 - total });

        this.#sortedEffectsProbabilities = probabilitiesArray.sort((a, b) => Number(a.probability) - Number(b.probability));
        this.#sortedProbabilitySegments = this.#updateProbabilitySegments();
    }

    /**
     * Retrieves an effect based on the probabilities computed from accumulated results
     * @returns {*} Effect
     */
    pickEffect() {
        let e = this.#pickEffectWithProbability();
        e = { name: 'minMoves', probability: 1 };

        if (e.name !== 'none') {
            this.#current = e.name;
        }

        return e;
    }

    /**
     * Clear effect
     * @param {*} key 
     * @returns 
     */
    clearEffect() {
        this.#current = 'none';
    }

    get current() {
        return this.#current;
    }

    get sortedEffectsProbabilities() {
        return this.#sortedEffectsProbabilities;
    }

    // Private

    #computeEffectProbability(name, { labour, necromancy, astrology }) {
        const { compute: {
                blockCellsProbability,
                minMovesProbability,
                changeBoardProbability,
                resetBoardProbability,
            }
        } = spellMechanics;

        // On the limit to infinite, the sum of of probabilities should not be over 1
        switch(name) {
            case 'blockCells':
                return blockCellsProbability(labour);
            case 'minMoves':
                return minMovesProbability(labour);
            case 'changeBoard':
                return changeBoardProbability(necromancy);
            case 'resetBoard':
                return resetBoardProbability(astrology);
            default:
                break;
        }
    }
    
    #updateProbabilitySegments() {
        const sortedEffectsProbabilities = this.#sortedEffectsProbabilities;

        // Accumulated probabilities: [0.34, 0.33, 0.33] => [0.34, 0.67, 1]
        return sortedEffectsProbabilities.reduce((acc, curr, index) => {
            const { name, probability } = curr;

            if (!index) {
                acc.push({ name, probability });
            } else {
                const lastProbability = acc[index - 1].probability;

                acc.push({ name, probability: lastProbability + probability })
            }

            return acc;
        }, []);
    }

    #pickEffectWithProbability() {
        const sortedEffectsProbabilities = this.#sortedEffectsProbabilities;
        const sortedProbabilitySegments = this.#sortedProbabilitySegments;
        const target = Math.random();
        const picked = sortedProbabilitySegments.find(upperBound => target <= upperBound.probability);

        return sortedEffectsProbabilities.find(({ name }) => String(picked.name) === String(name));
    }
}
