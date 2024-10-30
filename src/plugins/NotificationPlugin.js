import { selectById } from "@utils/data";
import {
    MODAL_H,
    MODAL_W,
    MODAL_Y,
    MODAL_X,
    STYLE_MODAL_TEXT
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

    newIngredient(ingredientId = null) {
        const mainScene = this.#game.scene.getScene('main');
        let groupChildren = [];

        const modal = this.#buildModal();
        const text = this.#buildText('You found a new item !');
        groupChildren.push(modal, text);

        if (ingredientId) {
            const { ingredients } = this.#game.cache.json.get('game');
            console.log(this.#game)
            const { label } = selectById(ingredients.items, ingredientId);
            
            const ingredientLabel = this.#buildText(label)
                .setY(MODAL_Y + MODAL_H - 20);

            const ingredientSprite = mainScene.add.sprite(
                MODAL_X + MODAL_W / 2,
                MODAL_Y + MODAL_H / 2,
                'main',
                `ingredient${ingredientId}`,
            ).setOrigin(0.5, 0.5);

            groupChildren.push(ingredientLabel, ingredientSprite);

            mainScene.tweens.addMultiple([
                {
                    targets: ingredientLabel,
                    y: ingredientLabel.y + 10,
                    duration: 600,
                    ease: 'quad.out'
                },
                {
                    targets: ingredientSprite,
                    y: ingredientSprite.y + 10,
                    duration: 600,
                    ease: 'quad.out',
                }
            ]);
        }

        const group = mainScene.add.group(groupChildren);

        group.setName('modal_newIngredient')
            .setDepth(2);

        mainScene.tweens.addMultiple([
            {
                targets: modal,
                y: modal.y + 10,
                duration: 600,
                ease: 'quad.out'
            },
            {
                targets: text,
                y: text.y + 10,
                duration: 600,
                ease: 'quad.out',
            }
        ]);
        
        setTimeout(() => group.destroy(true), 2500);
    }

    //--------------
    // Private
    //--------------

    #buildText(text = '') {
        const mainScene = this.#game.scene.getScene('main');
        let x = MODAL_X + MODAL_W / 2;
        let y = MODAL_Y + 20;
        let w = MODAL_W;
        let name = 'text_newIngredient';

        return mainScene.add.text(x, y, text, STYLE_MODAL_TEXT)
            .setWordWrapWidth(w - 5)
            .setOrigin(0.5, 0.5)
            .setToTop()
            .setName(name);
    }

    #buildModal() {
        const mainScene = this.#game.scene.getScene('main');

        const h = MODAL_H;
        const w = MODAL_W;
        const y = MODAL_Y;
        const x = MODAL_X;

        return mainScene.add.rectangle(x, y, w, h, 0x0)
            .setStrokeStyle(1, 0xaeaeae)
            .setOrigin(0, 0)
            .setToTop()
            .setName('box_newIngredient');
    }
}
