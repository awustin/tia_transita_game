const SMALL_DIALOG_X = 692;
const SMALL_DIALOG_Y = 104;
const SMALL_DIALOG_W = 156;
const SMALL_DIALOG_H = 52;
const LARGE_DIALOG_X = 0;
const LARGE_DIALOG_Y = 0;
import {
    STYLE_DIALOG,
} from "@constants";
import dialogs from "@data/dialogs.json";

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

    // Large: TBD chars
    #largeBubble = null;

    // Current speech bubble shown in the scene
    #currentBubble = null;
    #currentText = null

    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
        this.#dialogs = dialogs;
    }

    showCurrent() {
        console.log({ bubble: this.#currentBubble, text: this.#currentText});
    }

    addSpeechBubble(dialogId = null) {
        const dialog = dialogId ? this.#dialogs[String(dialogId)] : null;
    
        if (dialog) {
            this.#hideCurrent();

            const textData = dialog?.text || '';
            const size = this.#getBubbleSize(textData);
            let bubble;
            let text;

            if (size === 1 || size === 2) {
                bubble = this.#smallBubble || this.#createBubbleSmall();
                text = this.#createTextSmall(textData);
                this.#smallBubble = bubble;
            }

            bubble.setVisible(true);
            text.setVisible(true);
            
            // Track
            this.#currentBubble = bubble;
            this.#currentText = text;
        }
    }

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

    #getBubbleSize(str = '') {
        const length = str.length;

        if (length <= 44) {
            return 1;
        }
        
        return 2;
    }

    /**
     * Builds a small bubble
     */
    #createBubbleSmall() {
        const dialogScene = this.#game.scene.getScene('dialogs');
        return dialogScene.add.rectangle(
                    SMALL_DIALOG_X,
                    SMALL_DIALOG_Y,
                    SMALL_DIALOG_W,
                    SMALL_DIALOG_H,
                    0x0,
                    0.8
                )
                .setStrokeStyle(2, 0xcecece)
                .setOrigin(0, 0)
                .setName('smallBubble');
    }

    /**
     * Builds a small text object
     */
    #createTextSmall(text = '') {
        const dialogScene = this.#game.scene.getScene('dialogs');
        const textObject = dialogScene.add.text(
            SMALL_DIALOG_X + 5,
            SMALL_DIALOG_Y + 4,
            text,
            STYLE_DIALOG,
        )
        .setWordWrapWidth(SMALL_DIALOG_W - 5)
        .setName('smallText');

        return textObject;
    }
}
