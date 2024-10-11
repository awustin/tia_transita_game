export default class Sparkles extends Phaser.GameObjects.Sprite
{
    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            'atlas',
            'sparks1',
        );

        if (!this.scene.anims.exists('selected')) {
            this.scene.anims.create({
                key: 'selected',
                frames: this.anims.generateFrameNames('atlas', {
                    prefix: 'sparks',
                    start: 1,
                    end: 7,
                }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.anims.play('selected');
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }
}
