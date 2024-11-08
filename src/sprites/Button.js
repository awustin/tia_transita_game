import {
    MODAL_H,
    MODAL_W,
    MODAL_Y,
    MODAL_X,
    STYLE_MODAL_TEXT,
    BUTTON_W,
    BUTTON_H,
} from "@constants";

export default class Button extends Phaser.GameObjects.Container
{
    #button = null;
    #label = null;

    constructor(scene,
        {
            label = '',
            onClick = Function.prototype,
            x = 0,
            y = 0
        }
    ) {
        super(scene, x, y);

        this.#button = scene.add.sprite(0, 0, 'main', 'button');
        this.#label = scene.add.text(0, - this.#button.displayHeight / 2 + 5, label, STYLE_MODAL_TEXT)
            .setWordWrapWidth(this.#button.displayWidth - 5)
            .setOrigin(0.5, 0);

        this.add([this.#button, this.#label])
            .setName('button')
            .setSize(BUTTON_W, BUTTON_H)
            .setInteractive({ cursor: 'pointer' });

        this.on('pointerover', () => {
            this.#button.setFrame('buttonHover:2');
        });

        this.on('pointerout', () => {
            this.#button.setFrame('button');
        });

        this.on('pointerup', onClick);

        this.once('destroy', () => {
            this.#button.destroy();
            this.#label.destroy();
            this.removeAllListeners();
        });

        scene.add.existing(this);
    }
}
