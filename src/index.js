import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import ResultsEffects from './classes/ResultsEffects';
import IngredientsGameGrid from './classes/IngredientsGameGrid';
import IngredientsBasket from './classes/IngredientsBasket';

try {
    class IngredientsOrchardGame extends Phaser.Scene {
        preload () {
            this.load.on('progress', value => console.log(value));
            this.load.on('complete', () => console.log('Loaded!'));
            this.#settings();
        }
    
        create () {
            this.add.image(1500/2, 924/2, 'bg');
            this.#createIngredientsAnimations();

            const ingredientsPool = new IngredientsPool(this, [
                {id: 1, probability: 1/4},
                {id: 2, probability: 1/4},
                {id: 3, probability: 1/4},
                {id: 4, probability: 1/4},
            ]);
            const ingredientsGrid = new IngredientsGameGrid({
                scene: this,
                // Manually set :_(
                offsetX: 526,
                offsetY: 238
            });
            const basket = new IngredientsBasket(this);
            const accumulator = new ResultsAccumulator(this);
            const resultsEffects = new ResultsEffects(this);

            this.registry.debugText = this.add.text(0, 0, 'Debug Info...', { color: '#fff' });
            this.#debugInfoOnScreen();
           
            this.input.on('pointerup', (value, gameObject) => {
                const objectClass = gameObject[0]?.constructor.name || '';

                if (objectClass === 'Ingredient') {
                    const ingredient = gameObject[0];

                    if (ingredient.state !== 'idle' && ingredient.state !== 'active') {
                        return;
                    }

                    const index = basket.selectedIndex(ingredient);

                    if (index >= 0) {
                        basket.untrackSelectedIngredients(index)
                            .forEach(ingredient => ingredient.setIdle());
                    } else {
                        if (basket.trackIngredient(ingredient)) {
                            ingredient.setActive();
                        };
                    }

                    basket.toggleCollectAvailable();
                }
            })

            this.input.keyboard.on('keyup', ({ code }) => {
                const isCollectAvailable = this.registry.collectAvailable;

                if (isCollectAvailable && code === 'Space') {
                    const removed = basket.untrackSelectedIngredients(0);

                    removed.forEach(ingredient => {
                        ingredient.setCollected();
                        ingredientsGrid.replaceWithEmpty(ingredient);
                    });

                    accumulator.add(removed[0].typeId, removed.length);
                    resultsEffects.updateProbabilities(accumulator.getResults());
                    ingredientsPool.redistributeProbabilities(accumulator.amounts);
                    basket.toggleCollectAvailable();

                    // To do: analyze results. If it's winner emit WIN, else start a new move
                    this.events.emit('newmove');
                }
            })

            this.events.on('newmove', () => {
                resultsEffects.clearEffect();
                resultsEffects.pickEffect();

                //To do: apply effect
                ingredientsGrid.fillInWithNewIngredients();
                //To do: monitor available moves
            })
        }

        update () {
            this.#debugInfoOnScreen();
        }

        #settings () {
            this.load.image('bg', '../assets/bg.png');

            for (let i = 1; i <= 4; i++) {
                if (i === 1) {
                    this.load.spritesheet({
                        key: `ingredient${i}`,
                        url: 'assets/sprites/ingredient_1_spritesheet.png',
                        frameConfig: {
                            frameWidth: 64,
                            frameHeight: 80,
                            startFrame: 2,
                            endFrame: 15,
                        }
                    });
                } else if (i === 2) {
                    this.load.spritesheet({
                        key: `ingredient${i}`,
                        url: `assets/sprites/ingredient_2_spritesheet.png`,
                        frameConfig: {
                            frameWidth: 64,
                            frameHeight: 80,
                            startFrame: 2,
                            endFrame: 17
                        }
                    });
                } else if (i === 3) {
                    this.load.spritesheet({
                        key: `ingredient${i}`,
                        url: 'assets/sprites/ingredient_3_spritesheet.png',
                        frameConfig: {
                            frameWidth: 64,
                            frameHeight: 80,
                            startFrame: 2,
                            endFrame: 11,
                        }
                    });
                } else if (i === 4) {
                    this.load.spritesheet({
                        key: `ingredient${i}`,
                        url: 'assets/sprites/ingredient_4_spritesheet.png',
                        frameConfig: {
                            frameWidth: 64,
                            frameHeight: 80,
                            startFrame: 2,
                            endFrame: 10,
                        }
                    });
                }
            }

            this.registry.resultsConfig = {
                1: {labour: 1, astrology: 0, necromancy: 0},
                2: {labour: 0, astrology: 1, necromancy: 0},
                3: {labour: 0, astrology: 0, necromancy: 1},
                4: {labour: 2, astrology: 0, necromancy: 0},
            }
            this.registry.effectsConfig = {
                runningEffect: 'none',
                effects: {
                    'blockCells': {id: 1, params: null},
                    'maxMoves': {id: 2, params: null},
                    'changeBoard': {id: 3, params: null},
                    'resetBoard': {id: 4, params: null},
                }
            };
            this.registry.collectAvailable = false;
            this.registry.results = {
                labour: 0,
                necromancy: 0,
                astrology: 0
            };
            this.input.keyboard.addCapture('SPACE');
        }

        #createIngredientsAnimations () {
            for (let i = 1; i <= 4; i++) {
                if ( i === 1 ) {
                    this.anims.create({
                        key: `ingredient${i}_start`,
                        frameRate: 4,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 0 }),
                        repeat: 0,
                    });

                    this.anims.create({
                        key: `ingredient${i}_idle`,
                        frameRate: 9,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 1, end: 4 }),
                        repeat: -1,
                        yoyo: false,
                    });

                    this.anims.create({
                        key: `ingredient${i}_active`,
                        frameRate: 10,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 5, end: 11 }),
                        repeat: -1,
                        yoyo: false,
                    });

                    this.anims.create({
                        key: `ingredient${i}_destroy`,
                        frameRate: 9,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 12, end: 13 }),
                    });
                }  else if (i === 2) {
                    this.anims.create({
                        key: `ingredient${i}_start`,
                        frameRate: 4,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 0 }),
                        repeat: 0,
                    });

                    this.anims.create({
                        key: `ingredient${i}_idle`,
                        frameRate: 7,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 7 }),
                        repeat: -1,
                        // yoyo: true,
                    });

                    this.anims.create({
                        key: `ingredient${i}_active`,
                        frameRate: 8,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 8, end: 14 }),
                        repeat: -1,
                    });

                    this.anims.create({
                        key: `ingredient${i}_destroy`,
                        frameRate: 10,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 15, end: 15 }),
                        repeat: 0
                    });
                } else if (i === 3) {
                    this.anims.create({
                        key: `ingredient${i}_start`,
                        frameRate: 4,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 0 }),
                        repeat: 0,
                    });

                    this.anims.create({
                        key: `ingredient${i}_idle`,
                        frameRate: 9,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 1, end: 3 }),
                        repeat: -1,
                        yoyo: true,
                    });

                    this.anims.create({
                        key: `ingredient${i}_active`,
                        frameRate: 15,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 4, end: 6 }),
                        repeat: -1,
                        yoyo: true,
                    });

                    this.anims.create({
                        key: `ingredient${i}_destroy`,
                        frameRate: 6,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 7, end: 9 }),
                    });
                } else if (i === 4) {
                    this.anims.create({
                        key: `ingredient${i}_start`,
                        frameRate: 4,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 0 }),
                        repeat: 0,
                    });

                    this.anims.create({
                        key: `ingredient${i}_idle`,
                        frameRate: 9,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 1, end: 3 }),
                        repeat: -1,
                        yoyo: true,
                    });

                    this.anims.create({
                        key: `ingredient${i}_active`,
                        frameRate: 5,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 4, end: 6 }),
                        repeat: -1,
                        yoyo: true,
                    });

                    this.anims.create({
                        key: `ingredient${i}_destroy`,
                        frameRate: 6,
                        frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 7, end: 8 }),
                    });
                }
            }
        }

        #debugInfoOnScreen() {
            this.registry.debugText.setText([
                'Selected: ' + this.add.ingredientsBasket.selected.map(ingredients => ingredients.cell.join(':')),
                'Collect available: ' + this.registry.collectAvailable,
                'Labour: ' + this.registry.results.labour,
                'Necromancy: ' + this.registry.results.necromancy,
                'Astrology: ' + this.registry.results.astrology,
                'Running effect: ' + this.registry.effectsConfig.runningEffect
            ].join('\n'));
        }
    }
    
    const config = {
        type: Phaser.WEBGL,
        scene: IngredientsOrchardGame,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1500,
            height: 924
        }
    };
    
    const game = new Phaser.Game(config);
} catch (e) {
    throw new Error(e);
}