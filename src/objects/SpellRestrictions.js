import { spell as spellMechanics } from "@utils/mechanics";

export default class SpellRestrictions
{
    #scene;

    constructor(scene) {
        this.#scene = scene;
    }

    applyMovesRestriction() {
        const { constants: { MIN_MOVES }} = spellMechanics;

        console.log('Minimum number of moves: ', MIN_MOVES);
        // Trigger dialog scene
        // Show notification
        // Update basket with new limit
    }
}