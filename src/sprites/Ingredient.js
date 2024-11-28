import Sparkles from "@sprites/Sparkles";
import Skulls from "@sprites/Skulls";

export default class Ingredient extends Phaser.GameObjects.Sprite
{
    #id = null;
    #cell = [];
    #cellBorder = null;
    #sparkles = null;
    #skulls = null;
    #collectable = true;
    #pendingState = null;
    #initializing = false;

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
            'ingredients',
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

    get isBlocked() {
        return this.state === 'blocked';
    }

    setStart() {
        this.setScale(0,0);
        this.setAlpha(0.5);
        this.disableInteractive();
        this.#initializing = true;

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
            onComplete: () => {
                this.#initializing = false;

                switch(this.#pendingState) {
                    case 'blocked':
                        this.setBlocked();
                        break;
                    default:
                        this.setIdle();
                        break;
                }

                this.#pendingState = null;
            }
        });

        this.setState('start');
    }

    setIdle() {
        this.#setAsyncState(
            'idle',
            () => {
                this.setInteractive();
        
                if (this.#sparkles) {
                    this.#sparkles.destroy();
                }
        
                if (this.#skulls) {
                    this.#skulls.destroy();
                }
            },
        );
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
            onComplete: () => {
                this.removeAllListeners();
                this.destroy();
            },
        });

        if (this.#cellBorder) {
            this.#cellBorder.destroy();
        }

        if (this.#sparkles) {
            this.#sparkles.destroy();
        }

        if (this.#skulls) {
            this.#skulls.destroy();
        }
    }

    setBlocked() {
        this.#setAsyncState(
            'blocked',
            () => {
                const { x, y } = this.getBounds();
                this.disableInteractive();

                this.#sparkles = new Skulls({
                    scene: this.scene,
                    x,
                    y,
                });
        
                if (this.#cellBorder) {
                    this.#cellBorder.destroy();
                }
            },
        );
    }

    #setAsyncState(name, callback = Function.prototype) {
        if (this.#initializing) {
            this.#pendingState = name;
        } else {
            this.setState(name);
            (callback.bind(this))();
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