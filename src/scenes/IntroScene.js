import {
    STYLE_WHITE,
    TEXT_PRESS_SPACE_TO_START,
    TITLE_X,
    TITLE_Y
} from "@constants";

export default class MainScene extends Phaser.Scene
{
    constructor() {
        super('intro');
    }

    preload() {
        this.load.json('game', 'src/config/game.json');
        this.load.atlas('main', '../assets/atlas/main.png', '../assets/atlas/main.json');
        this.load.atlas('ingredients', '../assets/atlas/ingredients.png', '../assets/atlas/ingredients.json');
    }

    create() {
        this.plugins.start('supply');
        this.plugins.start('score');
        this.plugins.start('spell');

        const text = this.add.text(
            TITLE_X,
            TITLE_Y,
            TEXT_PRESS_SPACE_TO_START,
            STYLE_WHITE
        );

        text.setOrigin(0.5, 0.5);

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