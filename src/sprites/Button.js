export default class Button extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y) {
        super(scene, x || 0, y || 0, 'main', 'button');
        this.setOrigin(0, 0);
        this.setInteractive();
        this.scene.add.existing(this);

        this.on('pointerover', () => {
            this.setFrame('buttonHover:2');
        });

        this.on('pointerout', () => {
            this.setFrame('button');
        });
    }

    destroy() {
        console.log('button destroyed');
        this.removeAllListeners();
    }
}
