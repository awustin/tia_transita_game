import dialogsData from "@data/dialogs.json";

const selectGeneralComments = () => dialogsData?.general || {};
const selectLinkedComments = () => dialogsData?.linked || {};
const selectCommentsByIngredientId = ingredientId => (
    Object.values(dialogsData?.ingredientsDialogs || {})
        .filter(comment => Number(comment.ingredientId) === Number(ingredientId))
);

export default class DialogSequencer extends Phaser.GameObjects.GameObject
{
    #config = null;

    // Comments to be made at any point of the game
    #general = {};

    // Comments that are only made based on the ingredient ID asociated to it
    #linked = {};

    #timeline = null;

    constructor(scene) {
        if (!scene) {
            throw {
                message: 'DialogSequencer missing scene',
                code: 'C16'
            };
        }

        super(scene, 'dialogSequencer');

        this.#config = dialogsData;
        this.#general = selectGeneralComments();
    }

    setRegularDialogs({
        onSpeak = Function.prototype,
        seconds = 1,
    }) {
        if (this.#timeline) {
            this.#timeline.destroy();
            this.#timeline = null;
        }

        this.#timeline = this.scene.add.timeline({
            at: seconds * 1000,
            run: () => onSpeak(this.#selectRandomGeneralMessage()),
        })
        .repeat()
        .play();
    }

    #selectRandomGeneralMessage() {
        const ids = Object.keys(this.#general);
        const id = Math.floor(Math.random() * ids.length);

        return this.#general[id]?.text || '';
    }
}
