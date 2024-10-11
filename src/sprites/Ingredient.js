export default class Ingredient extends Phaser.GameObjects.Sprite
{
    #typeId = null;
    #cell = [];
    #square = null;

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

        super(
            config.scene,
            config.x,
            config.y,
            'atlas',
            `ingredient${typeId}`,
        );
        this.#typeId = typeId;
        this.#cell = cell;

        this.scene.add.existing(this);
        this.setInteractive();
        this.setStart();
        this.setName(`ingredient${typeId}`);

        this.on('pointerover', () => {
            this.#addCellBox();
        }, this);

        this.on('pointerout', () => {
            this.#destroyCellBox();
        }, this);
    }

    get typeId() {
        return this.#typeId;
    }

    get cell() {
        return this.#cell;
    }

    setStart() {
        this.setScale(0,0);
        this.setAlpha(0.5);

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
    }

    setActive() {
        this.setState('active');
    }

    setCollected() {
        this.setState('collected');

        this.scene.tweens.chain({
            targets: this,
            tweens: [
                {
                    alpha: 0.5,
                    y: this.y - 40,
                    duration: 500,
                    ease: 'quad.out'
                },
            ],
            loop: 0,
            onComplete: () => {
                this.#destroyCellBox();
                this.destroy();
            }
        });
    }

    #addCellBox() {
        const {
            x,
            y,
            height,
            width,
        } = this.getBounds();

        const square = this.scene.add.rectangle(x, y, width, height);

        square.setStrokeStyle(1, 0xFFFFFF);
        square.setOrigin(0, 0);
        this.#square = square;
    }

    #destroyCellBox() {
        this.#square.destroy();
    }
}