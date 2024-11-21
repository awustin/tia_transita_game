export default class Skulls extends Phaser.GameObjects.Sprite
{
    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            'main',
            'skulls1',
        );

        if (!this.scene.anims.exists('blocked')) {
            this.scene.anims.create({
                key: 'blocked',
                frames: this.anims.generateFrameNames('main', {
                    prefix: 'skulls',
                    start: 1,
                    end: 7,
                }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.anims.play('blocked');
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }
}
