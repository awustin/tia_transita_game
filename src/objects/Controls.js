import {
    BUTTON_CLOSE_X,
    BUTTON_SOUND_X,
    BUTTON_CONTROLS_Y,
    BUTTON_ON_OFF_X,
    BUTTON_COLLECT_X,
    BUTTON_COLLECT_Y,
    TEXT_X,
    TEXT_ON,
    TEXT_SOUND,
    TEXT_COLLECT,
    KEYBOARD_SPACE_Y,
    KEYBOARD_SPACE_X,
    STYLE_WHITE,
    STYLE_GREEN,
} from '@constants';

export default class Controls extends Phaser.GameObjects.GameObject
{
    #buttonClose = null;
    #buttonCollect = null;
    #toggleSound = null;

    constructor(scene = null, collectCallback = Function.prototype) {
        if (!scene) {
            throw {
                message: 'Controls: empty scene passed',
                code: 'C14'
            };
        }

        super(scene);

        // Todo: move collect functionality to scene plugins
        this.#addCollectButton(collectCallback);
        this.#addCloseButton();
        this.#addSoundToggle();
    }

    showCollectButton() {
        this.#buttonCollect?.setVisible(true);
    };

    hideCollectButton() {
        this.#buttonCollect?.setVisible(false);
    };

    #addCollectButton(callback = Function.prototype) {
        const text = this.scene.add.text(
            BUTTON_COLLECT_X,
            BUTTON_COLLECT_Y,
            TEXT_COLLECT,
            STYLE_WHITE
        );
        const keySprite = this.scene.add.sprite(KEYBOARD_SPACE_X, KEYBOARD_SPACE_Y, 'main', 'keyboard_space');

        text.setInteractive({ cursor: 'pointer' });
        text.setOrigin(0,0);
        text.on('pointerup', callback);
        keySprite.setOrigin(0,0);
        this.#buttonCollect = this.scene.add.group([ text, keySprite ]);
        this.#buttonCollect.setName('collectButton');
        this.#buttonCollect.setVisible(false);
    }

    #addCloseButton() {
        this.#buttonClose = this.scene.add.text(
            BUTTON_CLOSE_X,
            BUTTON_CONTROLS_Y,
            TEXT_X,
            STYLE_WHITE
        );

        this.#buttonClose.setInteractive({ cursor: 'pointer' });
        this.#buttonClose.on('pointerup', () => this.scene.scene.restart());
    }

    #addSoundToggle() {
        this.#toggleSound = this.scene.add.group([
            this.scene.add.text(
                BUTTON_SOUND_X,
                BUTTON_CONTROLS_Y,
                TEXT_SOUND,
                STYLE_WHITE
            ),
            this.scene.add.text(
                BUTTON_ON_OFF_X,
                BUTTON_CONTROLS_Y,
                TEXT_ON,
                STYLE_GREEN
            ),
        ]);
    }
}
