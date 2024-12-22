import {
    MERCURIA_X,
    MERCURIA_Y,
} from "@constants";

export default class Mercuria extends Phaser.GameObjects.Sprite
{
    #timeoutId = null;
    #current = '';

    constructor(scene) {
        super(
            scene,
            MERCURIA_X,
            MERCURIA_Y,
            'main',
            'mercuriaIdle1',
        );

        this.anims.create({
            key: 'mercuriaIdle',
            frames: this.anims.generateFrameNames('main', {
                prefix: 'mercuriaIdle',
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
        this.anims.play('mercuriaIdle');
    }
}
