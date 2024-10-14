import IngredientsGameGrid from '@objects/IngredientsGameGrid';
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
    ingredientsGrid = null;
    controls = null;

    constructor() {
        super('main');
    }

    init () {
        this.basket = this.plugins.get('basket');
        this.supply = this.plugins.get('supply');
        this.score = this.plugins.get('score');
        this.spell = this.plugins.get('spell');
        this.board = this.plugins.get('board');
        this.controls = this.plugins.get('controls');
    }

    preload () {
        this.load.atlas('main', '../assets/atlas/main.png', '../assets/atlas/main.json');
        this.input.keyboard.addCapture('SPACE');
    }

    create () {
        this.#createEnvironment();

        const {
            basket,
            board,
            spell,
            score,
        } = this;

        this.ingredientsGrid = new IngredientsGameGrid(this);
        board.matrix = this.ingredientsGrid.grid;
        
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
            if (basket.collectAvailable && code === 'Space') {
                return this.collectSelected();
            }

            if (code === 'KeyQ') {
                this.scene.restart();
            }
        });

        this.events.on('newmove', () => {
            spell.clearEffect();
            spell.pickEffect();

            //To do: apply effect
            this.ingredientsGrid.fillInWithNewIngredients();
            //To do: monitor available moves
        });
    }

    update () {
        this.#debugInfoOnScreen();
        this.controls.showCollectButton(this.basket.collectAvailable);
    }

    collectSelected () {
        const removed = this.basket.untrackSelectedIngredients(0) || [];

        if (removed.length) {
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
    }

    #createEnvironment () {
        const basement = this.add.image(BASEMENT_X, 0, 'main', 'basement');
        const staircase = this.add.image(STAIRCASE_X, 0, 'main', 'staircase');
        const mercuriaNpc = new MercuriaNPC(this);

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        mercuriaNpc.setIdle();

        this.controls.addCollectButton(this.collectSelected.bind(this));
        this.controls.addCloseButton();
        this.controls.addSoundToggle();
        
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
