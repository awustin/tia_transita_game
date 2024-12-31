export default class Blocked extends Phaser.GameObjects.Sprite
{
    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            'main',
            'blocked',
        );

        this.setOrigin(0, 0);
        this.scene.add.existing(this);
    }
}
