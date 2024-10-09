import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import ResultsEffects from './classes/ResultsEffects';
import IngredientsGameGrid from './classes/IngredientsGameGrid';
import IngredientsBasket from './classes/IngredientsBasket';

try {
    class IngredientsOrchardGame extends Phaser.Scene {
        preload () {
            this.#settings();
        }
    
        create () {
            this.#createEnvironment();

            const ingredientsPool = new IngredientsPool(this, [
                {id: 1, probability: 1/4},
                {id: 2, probability: 1/4},
                {id: 3, probability: 1/4},
                {id: 4, probability: 1/4},
            ]);
            const ingredientsGrid = new IngredientsGameGrid({
                scene: this,
                // Manually set :_(
                offsetX: 432,
                offsetY: 208,
            });
            const basket = new IngredientsBasket(this);
            const accumulator = new ResultsAccumulator(this);
            const resultsEffects = new ResultsEffects(this);
           
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
            this.load.atlas('atlas', '../assets/atlas/atlas.png', '../assets/atlas/atlas.json');

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

        #createEnvironment () {
            const basement = this.add.image(276, 0, 'atlas', 'basement');
            const staircase = this.add.image(224, 0, 'atlas', 'staircase');

            basement.setOrigin(0, 0);
            staircase.setOrigin(0, 0);
            
            this.registry.debugText = this.add.text(0, 0, 'Debug Info...', { color: '#fff' });
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
            width: 1280,
            height: 832
        }
    };
    
    const game = new Phaser.Game(config);
} catch (e) {
    throw new Error(e);
}