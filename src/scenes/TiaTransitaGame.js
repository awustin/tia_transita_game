import IngredientsPool from '@plugins/IngredientsPool';
import BoardMonitor from '@plugins/BoardMonitor';
import ResultsAccumulator from '@plugins/ResultsAccumulator';
import ResultsEffects from '@plugins/ResultsEffects';
import IngredientsBasket from '@plugins/IngredientsBasket';
import IngredientsGameGrid from '@objects/IngredientsGameGrid';
import MercuriaNPC from '@sprites/MercuriaNPC';
import {
    BASEMENT_X,
    STAIRCASE_X,
    initialState,
} from "@constants";

const {
    resultsConfig,
    results,
    runningEffect,
    effects,
    probabilities,
} = initialState;

export default class TiaTransitaGame extends Phaser.Scene
{
    preload () {
        this.#settings();
    }

    create () {
        this.#createEnvironment();

        const ingredientsPool = new IngredientsPool(this, probabilities);
        const ingredientsGrid = new IngredientsGameGrid(this);
        const basket = new IngredientsBasket(this);
        const accumulator = new ResultsAccumulator(this);
        const resultsEffects = new ResultsEffects(this);
        
        this.input.on('pointerup', (value, [ ingredient ]) => {
            if (ingredient?.collectable) {
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

        this.registry.resultsConfig = resultsConfig
        this.registry.effectsConfig = {
            runningEffect,
            effects
        };
        this.registry.collectAvailable = false;
        this.registry.results = results;

        this.input.keyboard.addCapture('SPACE');
    }

    #createEnvironment () {
        const basement = this.add.image(BASEMENT_X, 0, 'atlas', 'basement');
        const staircase = this.add.image(STAIRCASE_X, 0, 'atlas', 'staircase');
        const mercuriaNpc = new MercuriaNPC(this);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        mercuriaNpc.setIdle();
        
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
