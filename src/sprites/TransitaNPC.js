import {
    TRANSITA_X,
    TRANSITA_Y,
} from "@constants";

export default class TransitaNPC extends Phaser.GameObjects.Sprite
{
    #isWin = true;

    constructor(scene) {
        super(
            scene,
            TRANSITA_X,
            TRANSITA_Y,
            'end',
            'transita1',
        );

        this.anims.create({
            key: 'good_transita_idle',
            frames: this.anims.generateFrameNames('end', {
                prefix: 'transita',
                start: 1,
                end: 2,
            }),
            frameRate: 2,
            repeat: -1,
        });

        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }

    setIdle() {
        if (this.#isWin) {
            this.anims.play('good_transita_idle');
        } else {
            this.anims.play('evil_transita_idle');
        }
    }

    setBadEnding() {
        this.#isWin = false;
        this.setTexture('end', 'demon1');

        if (!this.anims.exists('evil_transita_idle')) {
            this.anims.create({
                key: 'evil_transita_idle',
                frames: this.anims.generateFrameNames('end', {
                    prefix: 'demon',
                    start: 1,
                    end: 2,
                }),
                frameRate: 16,
                repeat: -1,
            });
        }
    }
}
