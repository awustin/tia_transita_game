import dialogsData from "@data/dialogs.json";

const selectGeneral = () => dialogsData?.general || {};
const selectLinked = () => dialogsData?.linked || {};
const selectIngredientsDialogs = () => dialogsData?.ingredientsDialogs || {};

export default class DialogSequencer
{
    #scene = null;

    // Comments to be made at any point of the game
    #general = {
        ids: [],
        dialogs: {},
    };

    // Comments to be made in relation to an ingredient that's in the board
    #linked = {
        ids: [],
        dialogs: {},
    };

    #timeline = null;

    constructor(scene) {
        if (!scene) {
            throw {
                message: 'DialogSequencer missing scene',
                code: 'C16'
            };
        }

        if (!scene.plugins.get('supply')) {
            throw {
                message: 'DialogSequencer needs SupplyPlugin set up',
                code: 'C17'
            };
        }

        this.#scene = scene;
        this.updateGeneralDialogs();
        this.updateLinkedDialogs();
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

    updateGeneralDialogs() {
        this.#general.dialogs = selectGeneral();
        this.#general.ids = Object.keys(this.#general.dialogs);
    }

    updateLinkedDialogs() {
        const supply = this.#scene.plugins.get('supply');
        const currentIngredients = supply.currentIngredients.map(({ id }) => id) || [];
        const ingredientsDialogs = selectIngredientsDialogs();
        const linked = selectLinked();

        // Remove dialogs whose ingredients are not longer in the board
        this.#linked.ids = this.#linked.ids.reduce((acc, dialogId) => {
            // Get the ingredient ID with dialog ID
            const ingredientId = linked[String(dialogId)]?.ingredientId;

            if (currentIngredients.includes(Number(ingredientId))) {
                acc.push(dialogId);
            }

            return acc
        },
        []
        );

        // Get linked dialogs based on current ingredients
        currentIngredients.forEach(ingredientId => {
            // Get the dialog ID with ingredient ID
            const found = ingredientsDialogs[String(ingredientId)];

            if (found) {
                const foundDialogId = String(found.dialogId);

                if (!this.#linked.ids.includes(foundDialogId)) {
                    this.#linked.ids.push(foundDialogId);
                    this.#linked.dialogs[foundDialogId] = linked[foundDialogId];
                }
            }
        });
    }

    #getRandomMessage() {
        const idPool = [...this.#general.ids, ...this.#linked.ids];
        const dialogsPool = {...this.#general.dialogs, ...this.#linked.dialogs};
        const id = idPool[Math.floor(Math.random() * idPool.length)];

        return dialogsPool[id]?.text || '';
    }
}
