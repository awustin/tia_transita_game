import {
    MERCURIA_X,
    MERCURIA_Y,
} from "@constants";

export default class MercuriaNPC extends Phaser.GameObjects.Sprite
{
    constructor(scene) {
        super(
            scene,
            MERCURIA_X,
            MERCURIA_Y,
            'atlas',
            'mercuria_idle1',
        );

        this.anims.create({
            key: 'mercuria_idle',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'mercuria_idle',
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
        this.anims.play('mercuria_idle');
    }
}
