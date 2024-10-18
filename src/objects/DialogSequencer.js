import dialogsData from "@data/dialogs.json";

const selectGeneralComments = () => dialogsData?.general || {};
const selectLinkedComments = (ids = []) => ids.reduce((acc, ingredientId) => {
        const found = Object.values(dialogsData?.linked || {})
            .filter(dialog => Number(dialog.id) === Number(ingredientId));
    },
    {}
);

export default class DialogSequencer extends Phaser.GameObjects.GameObject
{
    #config = null;

    // Comments to be made at any point of the game
    #general = {};

    // Comments that are only made based on the ingredient ID asociated to it
    #linked = {};

    constructor(scene, config = {}) {
        if (!scene) {
            throw {
                message: 'DialogSequencer missing scene',
                code: 'C16'
            };
        }

        super(scene, 'timeline');
        this.#config = config;
    }
}
