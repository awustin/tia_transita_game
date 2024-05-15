import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import ResultsEffects from './classes/ResultsEffects';
import IngredientsGameGrid from './classes/IngredientsGameGrid';
import Ingredient from './classes/Ingredient';
import IngredientsBasket from './classes/IngredientsBasket';

try {
    class IngredientsOrchardGame extends Phaser.Scene {
        preload () {
            this.load.on('progress', value => console.log(value));
            this.load.on('complete', () => console.log('Loaded!'));
            this.#settings();
        }
    
        create () {
            this.#createIngredientsAnimations();
            this.#createManagers();
            this.#debugInfoOnScreen();
           
            this.input.on('pointerup', (value, gameObject) => {
                const basket = this.add.ingredientsBasket;
                const objectClass = gameObject[0]?.constructor.name || '';

                if (objectClass === 'Ingredient') {
                    const ingredient = gameObject[0];
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
                const basket = this.add.ingredientsBasket;
                const isCollectAvailable = this.registry.collectAvailable;
                const accumulator = this.add.resultsAccumulator;
                const resultsEffects = this.add.resultsEffects;
                const ingredientsPool = this.add.ingredientsPool;

                if (isCollectAvailable && code === 'Space') {
                    const removed = basket.untrackSelectedIngredients(0);

                    removed.forEach(ingredient => ingredient.setCollected());
                    accumulator.add(removed[0].typeId, removed.length);
                    resultsEffects.updateProbabilities(accumulator.getResults());
                    ingredientsPool.redistributeProbabilities(accumulator.amounts);

                    basket.toggleCollectAvailable();

                    // To do: analyze results. If it's winner emit WIN, else start a new move
                    this.events.emit('newmove');
                }
            })

            this.events.on('newmove', () => {
                const resultsEffects = this.add.resultsEffects;

                resultsEffects.clearEffect();
                resultsEffects.pickEffect();

                //To do: apply effect
                //To do: fill in new ingredients
                //To do: monitor available moves
            })
        }

        update () {
            this.#debugInfoOnScreen();
        }

        #settings () {
            for (let i = 1; i <= 4; i++) {
                this.load.spritesheet({
                    key: `ingredient${i}`,
                    url: `assets/sprites/ingredient_${i}.png`,
                    frameConfig: {
                        frameWidth: 64,
                        frameHeight: 64,
                        startFrame: 0,
                        endFrame: 12
                    }
                });
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
            this.registry.debugText = this.add.text(0, 0, 'Debug Info...', { color: '#fff' });
            this.registry.results = {
                labour: 0,
                necromancy: 0,
                astrology: 0
            };
        }

        #createIngredientsAnimations () {
            for (let i = 1; i <= 4; i++) {
                this.anims.create({
                    key: `ingredient${i}_start`,
                    frameRate: 4,
                    frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 0, end: 3 }),
                    repeat: 0,
                });

                this.anims.create({
                    key: `ingredient${i}_idle`,
                    frameRate: 5,
                    frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 4, end: 6 }),
                    repeat: -1,
                    yoyo: true,
                });

                this.anims.create({
                    key: `ingredient${i}_active`,
                    frameRate: 4,
                    frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 7, end: 10 }),
                    repeat: -1,
                });

                this.anims.create({
                    key: `ingredient${i}_destroy`,
                    frameRate: 8,
                    frames: this.anims.generateFrameNumbers(`ingredient${i}`, { start: 11, end: 12 }),
                    repeat: 0
                });
            }
        }

        #createManagers () {
            this.add.ingredientsPool = new IngredientsPool([
                {id: 1, probability: 1/4},
                {id: 2, probability: 1/4},
                {id: 3, probability: 1/4},
                {id: 4, probability: 1/4},
            ]);
            this.add.ingredientsGrid = new IngredientsGameGrid({
                scene: this,
                offsetX: this.game.config.width / 2,
                offsetY: this.game.config.height / 2
            });
            this.add.ingredientsBasket = new IngredientsBasket(this);
            this.add.resultsAccumulator = new ResultsAccumulator(this);
            this.add.resultsEffects = new ResultsEffects(this);

            // TEST DATA

            // let board = new BoardMonitor([
            //     [1,2,1,2],
            //     [2,3,1,3],
            //     [1,1,4,4],
            //     [4,2,1,3],
            // ])
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
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 910
        }
    };
    
    const game = new Phaser.Game(config);
} catch (e) {
    throw new Error(e);
}