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

export default class ControlsPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #buttonClose = null;
    #buttonCollect = null;
    #buttonCollectIsVisible = false;
    #toggleSound = null;

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
        const mainScene = this.#game.scene.getScene('main');
        const text = mainScene.add.text(
            BUTTON_COLLECT_X,
            BUTTON_COLLECT_Y,
            TEXT_COLLECT,
            STYLE_WHITE
        );
        const keySprite = mainScene.add.sprite(
            KEYBOARD_SPACE_X,
            KEYBOARD_SPACE_Y,
            'main',
            'keyboard_space'
        );

        text.setInteractive({ cursor: 'pointer' });
        text.setOrigin(0,0);
        text.on('pointerup', callback);
        keySprite.setOrigin(0,0);

        this.#buttonCollect = mainScene.add.group([ text, keySprite ]);
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
        const mainScene = this.#game.scene.getScene('main');
        this.#buttonClose = mainScene.add.text(
            BUTTON_CLOSE_X,
            BUTTON_CONTROLS_Y,
            TEXT_X,
            STYLE_WHITE
        );

        this.#buttonClose.setInteractive({ cursor: 'pointer' });
        this.#buttonClose.on('pointerup', callback);
    }

    addSoundToggle(callback = Function.prototype) {
        const mainScene = this.#game.scene.getScene('main');
        const label = mainScene.add.text(
            BUTTON_SOUND_X,
            BUTTON_CONTROLS_Y,
            TEXT_SOUND,
            STYLE_WHITE
        );
        const onOffText = mainScene.add.text(
            BUTTON_ON_OFF_X,
            BUTTON_CONTROLS_Y,
            TEXT_ON,
            STYLE_GREEN
        );

        onOffText.on('pointerup', callback);
        this.#toggleSound = mainScene.add.group([ label, onOffText ]);
    }
}
