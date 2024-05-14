export default class Ingredient extends Phaser.GameObjects.Sprite
{
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
        super(config.scene, config.x, config.y, 'ingredient', (typeId - 1) * 6);
        this.#typeId = typeId;
        this.#cell = cell;
        config.scene.add.existing(this);
        this.setInteractive();

        this.on('pointerdown', () => {
            if (this.#state === 'idle' || this.#state === 'start') {
                this.setActive();
            } else if (this.#state === 'active') {
                this.setIdle();
            }
        }, this);

        this.on('pointerover', () => {
            console.log(`ingredient at `, cell);
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
        console.log('start');
        this.#state = 'start';
    }

    setIdle() {
        console.log('idle');
        this.#state = 'idle';
    }

    setActive() {
        console.log('active');
        this.#state = 'active';
    }

    setCollected() {
        console.log('collected');
        this.#state = 'collected';
    }
}