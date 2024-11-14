import ModalGroup from "@objects/ModalGroup";
import { selectById } from "@utils/data";
import {
    TEXT_BUTTON_QUIT,
    TEXT_MIN_MOVES,
    TEXT_NEW_INGREDIENT,
    TEXT_PAUSED,
    TEXT_BUTTON_CANCEL,
} from "@constants";

/**
 * Creates interactive notificiations on screen
 */
export default class NotificationPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;

    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
    }

    onNewIngredient(ingredientId = null) {
        if (ingredientId) {
            const uiScene = this.#game.scene.getScene('ui');
            const mainScene = this.#game.scene.getScene('main');
            const { ingredients } = this.#game.cache.json.get('game');
            const { label } = selectById(ingredients.items, ingredientId);
            const modalGroup = new ModalGroup(uiScene);
    
            modalGroup.show({
                headerText: TEXT_NEW_INGREDIENT,
                bodyGameObject: uiScene.add.sprite(0, 0, 'ingredients', `ingredient${ingredientId}`),
                footerText: label,
            });
            modalGroup.animate();

            mainScene.scene.pause();

            uiScene.time.delayedCall(2000, () => {
                mainScene.scene.resume();
                modalGroup.destroy(true);
            }, [], this);
        }
    }

    onPauseMenu({ onConfirm = Function.prototype, onCancel = Function.prototype }) {
        const uiScene = this.#game.scene.getScene('ui');
        const mainScene = this.#game.scene.getScene('main');
        const modalGroup = new ModalGroup(uiScene);

        mainScene.scene.pause();

        modalGroup.show({
            headerText: TEXT_PAUSED,
            withButtons: true,
        });

        modalGroup.button(
            TEXT_BUTTON_QUIT,
            () => {
                mainScene.scene.resume();
                onConfirm();
            }
        ).setToLeft();

        modalGroup.button(
            TEXT_BUTTON_CANCEL,
            () => {
                mainScene.scene.resume();
                onCancel();
                modalGroup.destroy(true);
            }
        ).setToRight();
    }

    onSpell(name) {
        if (name === 'minMoves') {
            const uiScene = this.#game.scene.getScene('ui');
            const mainScene = this.#game.scene.getScene('main');
            const modalGroup = new ModalGroup(uiScene);
    
            modalGroup.show({
                bodyText: TEXT_MIN_MOVES,
            });
            modalGroup.animate();

            mainScene.scene.pause();

            uiScene.time.delayedCall(2000, () => {
                mainScene.scene.resume();
                modalGroup.destroy(true);
            }, [], this);
        }
    }
}
