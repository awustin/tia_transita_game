import Sparkles from "@sprites/Sparkles";
export default class Ingredient extends Phaser.GameObjects.Sprite
{
    #id = null;
    #cell = [];
    #cellBorder = null;
    #sparkles = null;
    #collectable = true;

    constructor(id = null, cell = [], config) {
        if (!id) {
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

        super(
            config.scene,
            config.x,
            config.y,
            'main',
            `ingredient${id}`,
        );
        this.#id = id;
        this.#cell = cell;

        this.scene.add.existing(this);
        this.setStart();
        this.setName(`ingredient${id}`);

        this.on('pointerover', () => {
            this.#addCellBorder();
        }, this);

        this.on('pointerout', () => {
            if (this.#cellBorder) {
                this.#cellBorder.destroy();
            }
        }, this);
    }

    get id() {
        return this.#id;
    }

    get cell() {
        return this.#cell;
    }

    get collectable() {
        return this.#collectable;
    }

    setStart() {
        this.setScale(0,0);
        this.setAlpha(0.5);
        this.disableInteractive();

        this.scene.tweens.chain({
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
            delay: 200,
            onComplete: () => this.setIdle()
        });

        this.setState('start');
    }

    setIdle() {
        this.setState('idle');

        this.setInteractive();

        if (this.#sparkles) {
            this.#sparkles.destroy();
        }
    }

    setActive() {
        const { x, y } = this.getBounds();

        this.#sparkles = new Sparkles({
            scene: this.scene,
            x,
            y,
        });

        this.setState('active');
        this.setInteractive();
    }

    setCollected() {
        this.setState('collected');

        this.disableInteractive();
        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    alpha: 0.1,
                    y: this.y - 40,
                    duration: 500,
                    ease: 'quad.out'
                },
            ],
            loop: 0,
            onComplete: () => this.destroy(),
        });

        if (this.#cellBorder) {
            this.#cellBorder.destroy();
        }

        if (this.#sparkles) {
            this.#sparkles.destroy();
        }
    }

    #addCellBorder() {
        const {
            x,
            y,
            height,
            width,
        } = this.getBounds();

        const box = this.scene.add.rectangle(x, y, width, height);

        box.setStrokeStyle(1, 0xFFFFFF);
        box.setOrigin(0, 0);
        this.#cellBorder = box;
    }
}