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
    board = null;
    ingredientsGrid = null

    constructor() {
        super('main');
    }

    init () {
        this.basket = this.plugins.get('basket');
        this.supply = this.plugins.get('supply');
        this.score = this.plugins.get('score');
        this.spell = this.plugins.get('spell');
        this.board = this.plugins.get('board');
    }

    preload () {
        this.#settings();
    }

    create () {
        this.#createEnvironment();
        this.ingredientsGrid = new IngredientsGameGrid(this);
        this.board.matrix = this.ingredientsGrid.grid;
        // Todo: don't pass collect callback to controls. Instead use plugins.
        const controls = new Controls(this, this.collect);
        
        this.input.on('pointerup', (value, [ ingredient ]) => {
            if (ingredient?.collectable) {
                if (ingredient.state !== 'idle' && ingredient.state !== 'active') {
                    return;
                }

                const index = this.basket.selectedIndex(ingredient);

                if (index >= 0) {
                    this.basket.untrackSelectedIngredients(index)
                        .forEach(ingredient => ingredient.setIdle());
                } else {
                    if (this.basket.trackIngredient(ingredient)) {
                        ingredient.setActive();
                    };
                }

                this.basket.toggleCollectAvailable();
            }
        });

        this.input.keyboard.on('keyup', ({ code }) => {
            const isCollectAvailable = this.basket.collectAvailable;

            if (isCollectAvailable && code === 'Space') {
                return this.collect();
            }

            if (code === 'KeyQ') {
                this.scene.stop();
                this.scene.start('end', this.score.results);
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
            this.spell.clearEffect();
            this.spell.pickEffect();

            //To do: apply effect
            this.ingredientsGrid.fillInWithNewIngredients();
            //To do: monitor available moves
        });
    }

    update () {
        this.#debugInfoOnScreen();
    }

    collect () {
        const removed = this.basket.untrackSelectedIngredients(0);

        removed.forEach(ingredient => {
            ingredient.setCollected();
            this.ingredientsGrid.replaceWithEmpty(ingredient);
        });

        this.score.add(removed[0].typeId, removed.length);
        this.spell.updateProbabilities(this.score.results);
        this.supply.redistributeProbabilities(this.score.amounts);
        this.basket.toggleCollectAvailable();

        // To do: analyze results. If it's winner emit WIN, else start a new move
        this.events.emit('newmove');
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
