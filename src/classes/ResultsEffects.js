/**
 * Enable / disable the effects in the game
 */
export default class ResultsEffects
{
    #scene = {};
    #effects = {};

    // Properties for probability computing. Need calibration
    #probabilityScaleFactor = 1/50;
    #sortedEffectsProbabilities = [{ name: 'none', probability: 1 }];
    #sortedProbabilitySegments = [];

    constructor(
        scene = null,
        defaultEffectsConfig = {
            'blockCells': {id: 1, params: null},
            'maxMoves': {id: 2, params: null},
            'changeBoard': {id: 3, params: null},
            'resetBoard': {id: 4, params: null},
        }
    ) {
        if (!scene) {
            throw {
                message: 'EffectPicker needs the current scene to modify the registry',
                code: 'C09'
            };
        }

        this.#scene = scene;
        this.#effects = this.#getRegistryConfig('effects') ?? defaultEffectsConfig;
        this.#sortedProbabilitySegments = this.#updateProbabilitySegments();
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

        if (e.name !== 'none')
            this.#setRegistryConfig('runningEffect', e.name);

        return e;
    }

    /**
     * Clear effect
     * @param {*} key 
     * @returns 
     */
    clearEffect() {
        this.#setRegistryConfig('runningEffect', 'none');
    }

    // Private

    #getRegistryConfig(key) {
        if (!this.#scene.registry?.effectsConfig) {
            return null;
        }

        return this.#scene.registry.effectsConfig[key];
    }

    #setRegistryConfig(key, value) {
        if (!this.#scene.registry?.effectsConfig) {
            return null;
        }

        this.#scene.registry.effectsConfig[key] = value;
    }

    #computeEffectProbability(name, { labour, necromancy, astrology }) {
        // On the limit to infinite, the sum of of probabilities should not be over 1
        switch(name) {
            case 'blockCells':
                return 3/10 - 3 / (this.#scaleInput(labour) + 10);
            case 'maxMoves':
                return 3/10 - 3 / (this.#scaleInput(labour) + 10);
            case 'changeBoard':
                return 1/5 - 1 / (this.#scaleInput(necromancy) + 5);
            case 'resetBoard':
                return 1/5 - 1 / (this.#scaleInput(astrology) + 5);
            default:
                break;
        }
    }

    #scaleInput(value) {
        return value * this.#probabilityScaleFactor;
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

    get sortedEffectsProbabilities() {
        return this.#sortedEffectsProbabilities;
    }
}