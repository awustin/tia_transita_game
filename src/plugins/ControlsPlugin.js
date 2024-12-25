import CollectButton from "@sprites/CollectButton";
import ScoreIcon from "@sprites/ScoreIcon";
import EffectIcon from "@sprites/EffectIcon";
import { selectByMaxValue } from "@utils/data";
import {
    BUTTON_CLOSE_X,
    BUTTON_SOUND_X,
    BUTTON_CONTROLS_Y,
    BUTTON_ON_OFF_X,
    TEXT_X,
    TEXT_OFF,
    TEXT_ON,
    TEXT_SOUND,
    STYLE_WHITE,
    STYLE_GREEN,
    STYLE_RED,
} from '@constants';

export default class ControlsPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #buttonClose = null;
    #buttonCollect = null;
    #iconScore = null;
    #iconEffect = null;
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
    
    addCollectButton() {
        const uiScene = this.#game.scene.getScene('ui');
        this.#buttonCollect = new CollectButton(uiScene);
    }

    setCollectButton(value) {
        if (this.#buttonCollect.enabled !== Boolean(value)) {
            this.#buttonCollect.setEnabled(value);
        }
    };

    addScoreIcon() {
        const uiScene = this.#game.scene.getScene('ui');
        this.#iconScore = new ScoreIcon(uiScene);
    }

    setScoreIcon(points = {}) {
        const {
            labour,
            astrology,
            necromancy,
        } = points;
        
        const { id: result } = selectByMaxValue([
            { id: 'labour', points: labour },
            { id: 'astrology', points: astrology} ,
            { id: 'necromancy', points: necromancy },
        ], 'points');

        switch(result) {
            case 'labour':
                this.#iconScore.setLabour();
                break;
            case 'necromancy':
                this.#iconScore.setNecromancy();
                break;
            case 'astrology':
                this.#iconScore.setAstrology();
                break;
            default:
                break;
        }
    }

    addEffectIcon() {
        const uiScene = this.#game.scene.getScene('ui');
        this.#iconEffect = new EffectIcon(uiScene);
    }

    setEffectIcon(spell = 'none') {
        switch(spell) {
            case 'minMoves':
                this.#iconEffect.setMinMoves();
                break;
            default:
                this.#iconEffect.setNone();
                break;
        }
    }

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
