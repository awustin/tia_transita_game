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
import dialogs from "@data/dialogs.json";

const getSize = (str = '') => {
    const length = str.length;

    if (length <= 44) {
        return 1;
    }
    
    return 2;
}
const isSmall = size => size === 1;
const isLarge = size => size === 2;

/**
 * Creates and destroys text bubbles as they are required at different moments of the game
 */
export default class SpeechBubblesPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;

    // Data from dialogs.json config
    #dialogs = {};

    // Small: 44 chars
    #smallBubble = null;

    // Large: 110 chars
    #largeBubble = null;

    // Current speech bubble shown in the scene
    #currentBubble = null;
    #currentText = null

    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
        this.#dialogs = dialogs;
    }

    add(dialogId = null) {
        const dialog = dialogId ? this.#dialogs[String(dialogId)] : null;
    
        if (dialog) {
            this.#hideCurrent();

            const dialogText = dialog?.text || '';
            const bubble = this.#useBubble(dialogText);
            const text = this.#buildText(dialogText);
            
            this.#storeBubble(bubble);
            bubble.setVisible(true);
            text.setVisible(true);
            this.#currentBubble = bubble;
            this.#currentText = text;
        }
    }

    removeCurrent() {
        return this.#hideCurrent();
    }

    //--------------
    // Private
    //--------------

    #hideCurrent() {
        if (this.#currentBubble) {
            this.#currentBubble.setVisible(false);
            this.#currentBubble = null;
        }

        if (this.#currentText) {
            this.#currentText.destroy();
            this.#currentText = null;
        }
    }

    #useBubble(text = '') {
        const size = getSize(text);
        let x = SMALL_DIALOG_X;
        let y = SMALL_DIALOG_Y;
        let w = SMALL_DIALOG_W;
        let h = SMALL_DIALOG_H;
        let name = 'smallBubble';

        if (isSmall(size) && this.#smallBubble) {
            return this.#smallBubble;
        }

        if (isLarge(size)) {
            if (this.#largeBubble) {
                return this.#largeBubble;
            }

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

        if (size === 2) {
            x = LARGE_DIALOG_X;
            y = LARGE_DIALOG_Y;
            w = LARGE_DIALOG_W;
            name = 'largeText';
        }

        return dialogScene.add.text(x + 5, y + 4, text, STYLE_DIALOG)
            .setWordWrapWidth(w - 5)
            .setName(name);
    }

    #storeBubble(bubble = null) {
        if (bubble) {
            const size = bubble.getData('size');

            if (isSmall(size)) {
                return this.#smallBubble = bubble;
            }

            if (isLarge(size)) {
                return this.#largeBubble = bubble;
            }
        }
    }
}
