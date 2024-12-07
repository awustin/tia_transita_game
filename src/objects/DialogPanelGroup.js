import {
    DIALOG_PANEL_H,
    DIALOG_PANEL_W,
    DIALOG_PANEL_X,
    DIALOG_PANEL_Y,
    STYLE_MODAL_TEXT,
} from "@constants";

export default class DialogPanel extends Phaser.GameObjects.Group
{
    #text = null;
    #timerEvent = null;

    constructor(scene) {
        super(scene);

        this.setName('dialogPanelGroup');
        this.scene.add.existing(this);

        this.add(
            this.scene.add.sprite(DIALOG_PANEL_X, DIALOG_PANEL_Y, 'main', 'dialogBox')
                .setOrigin(0, 0)
                .setToTop()
                .setName('panel')
        );

        this.once('destroy', () => {
            this.destroy(true);
        });
    }

    show() {
        this.setVisible(true);
    }

    hide() {
        this.setVisible(false);
    }

    addText(text, duration = 1, options = {}) {
        if (this.#timerEvent) {
            this.#timerEvent.remove();
            this.#timerEvent = null;
        }

        if (this.#text) {
            this.#text.destroy();
            this.#text = null;
        }

        const {
            padTop = 15,
            padBottom = 0,
            padLeft = 15,
            padRight = 0,
        } = options;

        // Initialize text
        this.#text = this.scene.add.text(
            DIALOG_PANEL_X + padLeft,
            DIALOG_PANEL_Y + padTop,
            '',
            STYLE_MODAL_TEXT
        )
        .setWordWrapWidth(DIALOG_PANEL_W - 5)
        .setOrigin(0, 0)
        .setToTop();

        this.add(this.#text);

        // Typewriter text
        let i = 0;
        this.#timerEvent = this.scene.time.addEvent({
            callback: () => {
                if (this.#text) {
                    this.#text.text += text[i];
                }

                i++;
                
                if (i === text.length) {
                    this.scene.time.addEvent({
                        callback: () => this.removeText(),
                        delay: duration * 1000,
                    })
                }
            },
            repeat: text.length - 1,
            delay: 20,
        });
    }

    removeText() {
        // Remove text
        if (this.#text) {
            this.#text.destroy();
            this.#text = null;
        }
    }
}
