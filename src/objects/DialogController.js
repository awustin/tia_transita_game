import DialogPanelGroup from "@objects/DialogPanelGroup";
import {
    select,
    selectByIds,
    join,
} from "@utils/data";

export default class DialogController
{
    #scene = null;

    // General dialogs.
    #general = [];

    // Dialogs present in the current timeline. Includes general and ingredient-specific.
    #current = [];

    #timeline = null;

    #panel = null;

    constructor(scene = null) {
        if (!scene) {
            throw {
                message: 'DialogController missing scene',
                code: 'C16'
            };
        }

        if (!scene.cache.json.get('game')) {
            throw {
                message: 'DialogController missing a game config object. Check it\'s being loaded in Intro scene',
                code: 'C17'
            };
        }

        this.#scene = scene;
        this.#setGeneralDialogs();
    }

    show() {
        if (!this.#panel) {
            this.#panel = new DialogPanelGroup(this.#scene);
        } else {
            this.#panel.show();
        }
    }

    hide() {
        if (this.#panel) {
            this.#panel.hide();
        }
    }

    destroy() {
        this.#panel.destroy();
    }

    setSpeakTimeline({
        secondsAt = 0,
        duration = 2,
    }) {
        const panel = this.#panel;

        if (this.#timeline) {
            this.#timeline.destroy();
            this.#timeline = null;
        }

        this.#timeline = this.#scene.add.timeline({
            at: secondsAt * 1000,
            run: () => panel.addText(
                this.#getRandomMessage(),
                duration,
            )
        })
        .repeat()
        .play();
    }

    updateCurrentDialogs(ingredientsSupply = {}) {
        const {
            ingredients,
            dialogs,
        } = this.#scene.cache.json.get('game');

        const currentIngredients = selectByIds(
            ingredients.items,
            ingredientsSupply.map(({ id }) => Number(id))
        );

        this.#current = [
            ...this.#general,
            ...join(dialogs.items, currentIngredients).on('ingredientId', 'id').as('ingredient')
        ];
    }

    stop() {
        if (this.#timeline) {
            this.#timeline.destroy();
            this.#timeline = null;
        }
    }

    get current() {
        return this.#current;
    }

    // ----------
    // Private
    // ----------

    #setGeneralDialogs() {
        const { dialogs } = this.#scene.cache.json.get('game');

        this.#general = select(dialogs.items, ({ ingredientId }) => !ingredientId);
    }

    #getRandomMessage() {
        const dialog = this.#current[Math.floor(Math.random() * this.#current.length)];

        return dialog?.text || '';
    }
}
