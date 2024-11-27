import eventsCentre from "@objects/EventsCentre";
import {
    BASEMENT_X,
    STAIRCASE_X,
    BLOOD_X,
    BLOOD_Y,
} from "@constants";
import TransitaNPC from "../sprites/TransitaNPC";

export default class EndScene extends Phaser.Scene
{
    score = null;
    controls = null;
    #isWin = false;

    constructor() {
        super('end');
    }

    init() {
        this.controls = this.plugins.get('controls');
        this.score = this.plugins.get('score');

        const { astrology, necromancy } = this.score.points;

        if (astrology >= necromancy) {
            this.#isWin = true;
        } else {
            this.#isWin = false;
        }
    }

    preload() {
        this.#settings();
    }

    create() {
        if (this.#isWin) {
            this.#createGoodEnding();
        } else {
            this.#createBadEnding();
        }

        this.input.on('pointerup', () => {
            this.teardownGame();
        });
    }

    update() {
    }

    teardownGame() {
        const {
            score,
        } = this;
        const gameScore = score.points;

        this.scene.stop('main');
        this.scene.stop('dialogs');
        this.scene.stop('ui');

        this.plugins.stop('score');
        this.plugins.stop('supply');
        this.plugins.stop('speech');
        this.plugins.stop('basket');
        this.plugins.stop('notification');
        this.plugins.stop('spell');
        this.plugins.stop('controls');
        eventsCentre.removeAllListeners();

        this.scene.start('intro', { isRestart: true, points: gameScore });
    }

    #settings() {
        this.load.atlas('end', '../assets/atlas/end.png', '../assets/atlas/end.json');
    }

    #createGoodEnding() {
        const basement = this.add.image(BASEMENT_X, 0, 'end', 'basementLight');
        const staircase = this.add.image(STAIRCASE_X, 0, 'end', 'staircaseLight');
        const transita = new TransitaNPC(this);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        transita.setIdle();
    }

    #createBadEnding() {
        const basement = this.add.image(BASEMENT_X, 0, 'end', 'basementDark');
        const staircase = this.add.image(STAIRCASE_X, 0, 'end', 'staircaseDark');
        const blood = this.add.image(BLOOD_X, BLOOD_Y, 'end', 'blood');
        const transita = new TransitaNPC(this);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        blood.setOrigin(0, 0);
        transita.setBadEnding();
        transita.setIdle();
    }
}