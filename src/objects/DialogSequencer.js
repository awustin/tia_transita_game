import {
    select,
    selectById,
    selectByIds,
    join,
} from "@utils/data";

export default class DialogSequencer
{
    #scene = null;

    // Dialogs present in the current timeline. Includes general and ingredient-specific.
    #current = []

    #timeline = null;

    constructor(scene = null) {
        if (!scene) {
            throw {
                message: 'DialogSequencer missing scene',
                code: 'C16'
            };
        }

        if (!scene.cache.json.get('game')) {
            throw {
                message: 'DialogSequencer missing a game config object. Check it\'s being loaded in Intro scene',
                code: 'C17'
            };
        }

        if (!scene.plugins.get('supply')) {
            throw {
                message: 'DialogSequencer needs SupplyPlugin to be set up',
                code: 'C18'
            };
        }

        this.#scene = scene;
        this.updateCurrentDialogs();
    }

    setSpeakTimeline({
        onSpeak = Function.prototype,
        secondsAt = 1,
    }) {
        if (this.#timeline) {
            this.#timeline.destroy();
            this.#timeline = null;
        }

        this.#timeline = this.#scene.add.timeline({
            at: secondsAt * 1000,
            run: () => onSpeak(this.#getRandomMessage()),
        })
        .repeat()
        .play();
    }

    updateCurrentDialogs() {
        const {
            ingredients,
            dialogs,
        } = this.#scene.cache.json.get('game');
        const supply = this.#scene.plugins.get('supply');

        const currentIngredients = selectByIds(
            supply.currentIngredients.map(({ id }) => Number(id)),
            ingredients.items
        );

        this.#current = [
            ...select(dialogs.items, ({ ingredientId }) => !ingredientId),
            ...join({
                left: dialogs.items,
                leftOn: 'ingredientId',
                right: currentIngredients,
                rightOn: 'id',
                nameAs: 'ingredient',
            }),
        ];
    }

    #getRandomMessage() {
        const { dialogs: { ids: lookUpIds } } = this.#scene.cache.json.get('game');

        const id = Math.floor(Math.random() * this.#current.length);
        
        return selectById(lookUpIds[id], this.#current)?.text || '';
    }
}
