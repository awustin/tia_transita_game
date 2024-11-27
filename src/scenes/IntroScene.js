import {
    STYLE_WHITE,
    TEXT_PRESS_SPACE_TO_START,
    TEXT_GAME_OVER,
    TITLE_X,
    TITLE_Y
} from "@constants";

export default class MainScene extends Phaser.Scene
{
    #isRestart = false;
    #points = {};

    constructor() {
        super('intro');
    }

    init({ isRestart = false, points }) {
        if (isRestart) {
            this.#isRestart = true;
            this.#points = points || {};
        }
    }

    preload() {
        this.load.json('game', 'src/config/game.json');
        this.load.atlas('main', '../assets/atlas/main.png', '../assets/atlas/main.json');
        this.load.atlas('ingredients', '../assets/atlas/ingredients.png', '../assets/atlas/ingredients.json');
    }

    create() {
        this.plugins.start('spell');
        this.plugins.start('supply');
        this.plugins.start('score');
        this.plugins.start('basket');
        this.plugins.start('controls');
        this.plugins.start('speech');
        this.plugins.start('notification');

        if (this.#isRestart) {
            this.add.text(
                TITLE_X,
                TITLE_Y - 120,
                TEXT_GAME_OVER,
                STYLE_WHITE
            ).setOrigin(0.5, 0.5);

            this.add.text(
                TITLE_X,
                TITLE_Y - 60,
                Object.entries(this.#points).map(([k, v]) => `${k}: ${v}`).join('\n'),
                STYLE_WHITE
            ).setOrigin(0.5, 0.5);
        }

        this.add.text(
            TITLE_X,
            TITLE_Y,
            TEXT_PRESS_SPACE_TO_START,
            STYLE_WHITE
        ).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keyup', ({ code }) => {
            if (code === 'Space') {
                const main = this.scene.get('main');
                const ui = this.scene.get('ui');
    
                this.scene.stop();
                main.scene.start();
                ui.scene.start();
            }
        });
    }
}