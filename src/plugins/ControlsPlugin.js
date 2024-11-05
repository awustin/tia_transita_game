import {
    BUTTON_CLOSE_X,
    BUTTON_SOUND_X,
    BUTTON_CONTROLS_Y,
    BUTTON_ON_OFF_X,
    BUTTON_COLLECT_X,
    BUTTON_COLLECT_Y,
    TEXT_X,
    TEXT_OFF,
    TEXT_ON,
    TEXT_SOUND,
    TEXT_COLLECT,
    KEYBOARD_SPACE_Y,
    KEYBOARD_SPACE_X,
    STYLE_WHITE,
    STYLE_GREEN,
    STYLE_RED,
} from '@constants';

export default class ControlsPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #buttonClose = null;
    #buttonCollect = null;
    #buttonCollectIsVisible = false;
    #toggleSound = null;
    #soundActive = true;
    #soundLabel = null;

    constructor(pluginManager) {
        if (!pluginManager) {
            throw {
                message: 'ControlsPlugin missing argument',
                code: 'C14'
            };
        }

        super(pluginManager);
        this.#game = pluginManager.game;
    }
    
    addCollectButton(callback = Function.prototype) {
        const uiScene = this.#game.scene.getScene('ui');
        const text = uiScene.add.text(
            BUTTON_COLLECT_X,
            BUTTON_COLLECT_Y,
            TEXT_COLLECT,
            STYLE_WHITE
        );
        const keySprite = uiScene.add.sprite(
            KEYBOARD_SPACE_X,
            KEYBOARD_SPACE_Y,
            'main',
            'keyboard_space'
        );

        text.setInteractive({ cursor: 'pointer' });
        text.setOrigin(0,0);
        text.on('pointerup', callback);
        keySprite.setOrigin(0,0);

        this.#buttonCollect = uiScene.add.group([ text, keySprite ]);
        this.#buttonCollect.setName('collectButton');
        this.#buttonCollect.setVisible(false);
        this.#buttonCollectIsVisible = false;
    }

    showCollectButton(value) {
        if (Boolean(value) != Boolean(this.#buttonCollectIsVisible)) {
            this.#buttonCollect?.setVisible(value);
            this.#buttonCollectIsVisible = value;
        }
    };

    addCloseButton(callback = Function.prototype) {
        const uiScene = this.#game.scene.getScene('ui');
        this.#buttonClose = uiScene.add.text(
            BUTTON_CLOSE_X,
            BUTTON_CONTROLS_Y,
            TEXT_X,
            STYLE_WHITE
        );

        this.#buttonClose.setInteractive({ cursor: 'pointer' });
        this.#buttonClose.on('pointerup', callback);
    }

    addSoundToggle(isActive = true) {
        const uiScene = this.#game.scene.getScene('ui');
        const label = isActive ? TEXT_ON : TEXT_OFF;
        this.#soundActive = isActive;
        this.#toggleSound = uiScene.add.text(
            BUTTON_SOUND_X,
            BUTTON_CONTROLS_Y,
            TEXT_SOUND,
            STYLE_WHITE
        );
        this.#soundLabel = uiScene.add.text(
            BUTTON_ON_OFF_X,
            BUTTON_CONTROLS_Y,
            label,
            STYLE_GREEN
        );

        this.#toggleSound.setInteractive({ cursor: 'pointer' });

        this.#toggleSound.on('pointerup', () => {
            if (this.#soundActive) {
                this.#soundLabel.setText(TEXT_OFF);
                this.#soundLabel.setStyle(STYLE_RED);
            } else {
                this.#soundLabel.setText(TEXT_ON);
                this.#soundLabel.setStyle(STYLE_GREEN);
            }

            this.#soundActive = !this.#soundActive;
        });
    }

    get soundActive() {
        return this.#soundActive;
    }
}
