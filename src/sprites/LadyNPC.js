export default class LadyNPC extends Phaser.GameObjects.Sprite
{
    #scene = null;

    constructor(config) {
        super(0,0);
        this.#scene = config.scene;

        this.#scene.add.existing(this);
    }
}