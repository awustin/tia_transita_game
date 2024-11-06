import ModalGroup from "@objects/ModalGroup";
import { selectById } from "@utils/data";
import { TEXT_NEW_INGREDIENT } from "@constants";

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

            mainScene.scene.pause();
    
            setTimeout(() => {
                modalGroup.destroy(true);
                mainScene.scene.resume();
            }, 2000);
        }
    }

    onPauseMenu({ onQuit = Function.prototype, onCancel = Function.prototype }) {
        // Todo - implement
    }
}
