import {
    BASEMENT_X,
    STAIRCASE_X,
} from "@constants";
import TransitaNPC from "../sprites/TransitaNPC";

export default class EndScene extends Phaser.Scene
{
    #isWin = false;

    constructor() {
        super('end');
    }

    init(data) {
        console.log(data);

        // Todo: implement scores calculation

        this.#isWin = true;
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
    }

    update() {
    }

    #settings() {
        const a = this.load.atlas('end', '../assets/atlas/end.png', '../assets/atlas/end.json');
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
        const transita = new TransitaNPC(this, true);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        transita.setIdle();
    }
}