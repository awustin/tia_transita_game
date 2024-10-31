import IngredientsTree from "@objects/IngredientsTree";
import IngredientsGrid from '@objects/IngredientsGrid';
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
    grid = null;
    tree = null;
    controls = null;
    notification = null;
    moves = 0;

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
        this.notification = this.plugins.get('notification');
        this.scene.launch('dialogs');
    }

    preload () {
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

        this.tree = new IngredientsTree(this);
        this.grid = new IngredientsGrid(this);
        board.matrix = this.grid.array;
        
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
            const {
                spell,
                tree,
                grid,
            } = this;

            this.moves++;
            spell.clearEffect();

            if (tree.isBranchLevelUp(this.moves)) {
                this.levelUpNewIngredient();
            } else {
                spell.pickEffect();

                //Todo: apply effect
            }

            grid.fillInWithNewIngredients();

            //Todo: monitor available moves
        });
    }

    update () {
        this.#debugInfoOnScreen();
        this.controls.showCollectButton(this.basket.collectAvailable);
    }

    collectSelected () {
        const {
            grid,
            score,
            spell,
            supply,
            basket,
            tree,
        } = this;
        const removed = basket.untrackSelectedIngredients(0) || [];

        if (removed.length) {
            removed.forEach(ingredient => {
                ingredient.setCollected();
                grid.voidSingleIngredient(ingredient);
            });
    
            score.add(removed[0].id, removed.length);
            spell.updateProbabilities(score.points);
            supply.updateProbabilities(score.amounts);
            tree.updateProbabilites(score.points);
            basket.toggleCollectAvailable();
    
            // To do: analyze results. If it's winner emit WIN, else start a new move
            this.events.emit('newmove');
        }
    }

    levelUpNewIngredient () {
        const {
            tree,
            score,
            grid,
            supply,
            notification,
        } = this;
        const voided = [];

        const {
            add: addId,
            remove: removeId,
            slots
        } = tree.levelUpBranch(score.amounts);

        if (addId && removeId) {
            notification.newIngredient(addId);

            supply.updateIngredientsSlots(slots);
            const removeExtraId = supply.updateExtraIngredient();
            score.addCurrentIngredient(addId, removeId);

            voided.push(removeId, removeExtraId);

            if (voided.length) {
                grid.voidByIngredientId(voided.length === 1 ? voided[0] : voided);
            }
        }
    }

    #createEnvironment () {
        const basement = this.add.image(BASEMENT_X, 0, 'main', 'basement');
        const staircase = this.add.image(STAIRCASE_X, 0, 'main', 'staircase');

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);

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
        } = this.score.points;
        const spell = this.spell;
        const tree = this.tree

        this.registry.debugText.setText([
            'Selected: ' + basket.selected.map(ingredients => ingredients.cell.join(':')),
            'Collect available: ' + basket.collectAvailable,
            'Labour: ' + labour,
            'Necromancy: ' + necromancy,
            'Astrology: ' + astrology,
            'Spell: ' + spell.current,
            'Last level up failed: ' + tree.lastLevelUpFailed,
            'Moves: ' + this.moves,
            'Amounts: ' + Object.keys(this.score.amounts).map(id => `\n  ${id}: ${this.score.amounts[id]}`)
        ].join('\n'));
    }
}
