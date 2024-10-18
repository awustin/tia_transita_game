import {
    SMALL_DIALOG_X,
    SMALL_DIALOG_Y,
    SMALL_DIALOG_W,
    SMALL_DIALOG_H,
    LARGE_DIALOG_X,
    LARGE_DIALOG_Y,
    LARGE_DIALOG_W,
    LARGE_DIALOG_H,
    STYLE_DIALOG,
} from "@constants";

const getSize = (str = '') => {
    const length = str.length;

    if (length <= 44) {
        return 1;
    }
    
    return 2;
}
const isSmall = size => size === 1; // length <= 44 chars
const isLarge = size => size === 2; // length ideally not greater than 110 chars

/**
 * Creates text bubbles
 */
export default class SpeechBubblesPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;

    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
    }

    comment(message = null) {    
        if (message) {
            const dialogScene = this.#game.scene.getScene('dialogs');
            const bubble = this.#buildBubble(message);
            const text = this.#buildText(message);

            return dialogScene.add.group([ bubble, text ], { name: 'comment' });
        }
    }

    //--------------
    // Private
    //--------------

    #buildBubble(text = '') {
        const size = getSize(text);
        let x = SMALL_DIALOG_X;
        let y = SMALL_DIALOG_Y;
        let w = SMALL_DIALOG_W;
        let h = SMALL_DIALOG_H;
        let name = 'smallBubble';

        if (isLarge(size)) {
            x = LARGE_DIALOG_X;
            y = LARGE_DIALOG_Y;
            w = LARGE_DIALOG_W;
            h = LARGE_DIALOG_H;
            name = 'largeBubble';
        }

        const dialogScene = this.#game.scene.getScene('dialogs');

        return dialogScene.add.rectangle(x, y, w, h, 0x0, 0.7)
            .setStrokeStyle(1, 0xaeaeae)
            .setOrigin(0, 0)
            .setName(name)
            .setData('size', size);
    }

    #buildText(text = '') {
        const size = getSize(text);
        const dialogScene = this.#game.scene.getScene('dialogs');
        let x = SMALL_DIALOG_X;
        let y = SMALL_DIALOG_Y;
        let w = SMALL_DIALOG_W;
        let name = 'smallText';

        if (isLarge(size)) {
            x = LARGE_DIALOG_X;
            y = LARGE_DIALOG_Y;
            w = LARGE_DIALOG_W;
            name = 'largeText';
        }

        return dialogScene.add.text(x + 5, y + 4, text, STYLE_DIALOG)
            .setWordWrapWidth(w - 5)
            .setName(name);
    }
}
