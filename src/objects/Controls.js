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
} from '@constants';

const style = {
    color: '#c6c6c6',
    fontFamily: 'munro',
    fontSize: 20
};

const styleGreen = {
    color: '#dfff68',
    fontFamily: 'munro',
    fontSize: 20
};

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
            style
        );
        const keySprite = this.scene.add.sprite(KEYBOARD_SPACE_X, KEYBOARD_SPACE_Y, 'atlas', 'keyboard_space');

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
            style
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
                style
            ),
            this.scene.add.text(
                BUTTON_ON_OFF_X,
                BUTTON_CONTROLS_Y,
                TEXT_ON,
                styleGreen
            ),
        ]);
    }
}
