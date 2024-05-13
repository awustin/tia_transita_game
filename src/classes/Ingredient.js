export default class Ingredient extends Phaser.GameObjects.Sprite
{
    _typeId = null;
    _state = 'idle';
    _cell = [];
    _labour = 0;
    _necromancy = 0;
    _astrology = 0;

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

        super(config.scene, config.x, config.y, `ingredient_${typeId}`);
        this._typeId = typeId;
        this._cell = cell;
        config.scene.add.existing(this);
        this.setInteractive();

        this.on('pointerdown', () => {
            if (this._state === 'idle') {
                this.setActive();
            } else if (this._state === 'active') {
                this.setIdle();
            }
        }, this);

        this.on('pointerover', () => {
            console.log(`ingredient at `, cell);
        }, this);
    }

    get typeId() {
        return this._typeId;
    }

    get state() {
        return this._state;
    }

    get cell() {
        return this._cell;
    }

    setStart() {
        console.log('start');
        this._state = 'start';
    }

    setIdle() {
        console.log('idle');
        this._state = 'idle';
    }

    setActive() {
        console.log('active');
        this._state = 'active';
    }

    setCollected() {
        console.log('collected');
        this._state = 'collected';
    }
}