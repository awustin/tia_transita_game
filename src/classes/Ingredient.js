export default class Ingredient extends Phaser.GameObjects.Sprite
{
    #scene = null;
    #typeId = null;
    #state = 'start';
    #cell = [];

    constructor(typeId = null, cell = [], config) {
        if (!typeId) {
            throw {
                message: 'Ingredient missing type id',
                code: 'C05'
            }
        }
        if (!cell.length || cell.length !== 2) {
            throw {
                message: 'Ingredient cell positioning missing or invalid',
                code: 'C06'
            }
        }

        // To do: get proper textures for each type of ingredients
        super(
            config.scene,
            config.x,
            config.y,
            `ingredient${typeId}`,
            0
        );
        this.#typeId = typeId;
        this.#cell = cell;
        this.#scene = config.scene;

        this.#scene.add.existing(this);
        this.setInteractive();
        this.setStart();

        this.on('pointerover', () => {
            // console.log(`ingredient at `, cell);
        }, this);
    }

    get typeId() {
        return this.#typeId;
    }

    get state() {
        return this.#state;
    }

    get cell() {
        return this.#cell;
    }

    setStart() {
        this.setScale(0,0);
        this.setAlpha(0.5);
        this.play(`ingredient${this.#typeId}_start`);

        this.#scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    alpha: 1,
                    scale: 1,
                    duration: 600,
                    ease: 'quad.out'
                },
            ],
            loop: 0,
            // loopDelay: 300,
            onComplete: () => this.setIdle()
        });

        this.#state = 'start';
    }

    setIdle() {
        this.play(`ingredient${this.#typeId}_idle`);
        this.#state = 'idle';
    }

    setActive() {
        this.play(`ingredient${this.#typeId}_active`);
        this.#state = 'active';
    }

    setCollected() {
        this.play(`ingredient${this.#typeId}_destroy`);
        this.#state = 'collected';

        this.#scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    alpha: 0.5,
                    y: this.y - 50,
                    duration: 400,
                    ease: 'quad.out'
                },
            ],
            loop: 0,
            onComplete: () => this.destroy()
        });

        // this.once('animationcomplete', () => this.destroy());
    }
}