import BoardMonitor from '@plugins/BoardMonitor';
import IngredientsGameGrid from '@objects/IngredientsGameGrid';
import Controls from '@objects/Controls';
import MercuriaNPC from '@sprites/MercuriaNPC';
import {
    BASEMENT_X,
    STAIRCASE_X,
} from "@constants";
export default class MainScene extends Phaser.Scene
{
    basket = null;
    supply = null;
    score = null;
    spell = null;

    constructor() {
        super('main');
    }

    init () {
        this.basket = this.plugins.get('basket');
        this.supply = this.plugins.get('supply');
        this.score = this.plugins.get('score');
        this.spell = this.plugins.get('spell');
    }

    preload () {
        this.#settings();
    }

    create () {
        this.#createEnvironment();

        // Todo: move these classes to plugins
        const ingredientsGrid = new IngredientsGameGrid(this);
        const basket = this.basket;
        const supply = this.supply;
        const score = this.score;
        const spell = this.spell;
        const collect = () => {
            const removed = basket.untrackSelectedIngredients(0);

            removed.forEach(ingredient => {
                ingredient.setCollected();
                ingredientsGrid.replaceWithEmpty(ingredient);
            });

            score.add(removed[0].typeId, removed.length);
            spell.updateProbabilities(score.results);
            supply.redistributeProbabilities(score.amounts);
            basket.toggleCollectAvailable();

            // To do: analyze results. If it's winner emit WIN, else start a new move
            this.events.emit('newmove');
        }
        // Todo: don't pass collect callback to controls. Instead use plugins.
        const controls = new Controls(this, collect);
        
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
        });

        this.input.keyboard.on('keyup', ({ code }) => {
            const isCollectAvailable = basket.collectAvailable;

            if (isCollectAvailable && code === 'Space') {
                return collect();
            }

            if (code === 'KeyQ') {
                this.scene.stop();
                this.scene.start('end', score.results);
            }
        });

        this.events.on('collect', isAvailable => {
            if (isAvailable) {
                controls.showCollectButton();
            } else {
                controls.hideCollectButton();
            }
        });

        this.events.on('newmove', () => {
            spell.clearEffect();
            spell.pickEffect();

            //To do: apply effect
            ingredientsGrid.fillInWithNewIngredients();
            //To do: monitor available moves
        });
    }

    update () {
        this.#debugInfoOnScreen();
    }

    #settings () {
        this.load.atlas('main', '../assets/atlas/main.png', '../assets/atlas/main.json');
        this.input.keyboard.addCapture('SPACE');
    }

    #createEnvironment () {
        const basement = this.add.image(BASEMENT_X, 0, 'main', 'basement');
        const staircase = this.add.image(STAIRCASE_X, 0, 'main', 'staircase');
        const mercuriaNpc = new MercuriaNPC(this);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        mercuriaNpc.setIdle();
        
        this.registry.debugText = this.add.text(0, 0, 'Debug Info...');
    }

    #debugInfoOnScreen() {
        const basket = this.basket;
        const {
            labour,
            necromancy,
            astrology,
        } = this.score.results;
        const spell = this.spell;

        this.registry.debugText.setText([
            'Selected: ' + basket.selected.map(ingredients => ingredients.cell.join(':')),
            'Collect available: ' + basket.collectAvailable,
            'Labour: ' + labour,
            'Necromancy: ' + necromancy,
            'Astrology: ' + astrology,
            'Spell: ' + spell.current,
        ].join('\n'));
    }
}
