import eventsCentre from "@objects/EventsCentre";
import IngredientsTree from "@objects/IngredientsTree";
import IngredientsGrid from "@objects/IngredientsGrid";
import { game as gameMechanics } from "@utils/mechanics";
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
    notification = null;
    moves = 0;

    constructor() {
        super('main');
    }

    init () {
        this.moves = 0;
        this.basket = this.plugins.get('basket');
        this.supply = this.plugins.get('supply');
        this.score = this.plugins.get('score');
        this.spell = this.plugins.get('spell');
        this.board = this.plugins.get('board');
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
        } = this;

        this.tree = new IngredientsTree(this);
        this.grid = new IngredientsGrid(this);
        board.matrix = this.grid.array;
        
        // Ingredients selected
        this.input.on('pointerup', (value, [ ingredient ]) => {
            if (ingredient?.collectable) {
                if (ingredient.state !== 'idle' && ingredient.state !== 'active') {
                    return;
                }

                const index = basket.selectedIndex(ingredient);

                if (index >= 0) {
                    basket.untrackSelectedIngredients(index).forEach(ingredient => ingredient.setIdle());
                } else {
                    if (basket.trackIngredient(ingredient)) {
                        ingredient.setActive();
                    };
                }

                if (basket.checkCollectEnabled(spell.currentMinMoves())) {
                    basket.collectAvailable = true;
                } else {
                    basket.collectAvailable = false;
                }
            }
        });

        // Collect ingredients on key pressed
        this.input.keyboard.on('keyup', ({ code }) => {
            if (basket.collectAvailable && (code === 'Space' || code === 'KeyQ')) {
                return this.collectSelected();
            }
        });

        // Collect ingredients on button clicked
        eventsCentre.on('collectButtonClick', () => this.collectSelected());

        // Start a new move
        eventsCentre.on('newMove', () => {
            const {
                spell,
                tree,
                grid,
                supply,
                score,
                notification,
            } = this;
            const voidIngredientsIds = [];

            this.moves++;
            spell.clearEffect();

            // Grab new ingredient or apply spell
            if (tree.isBranchLevelUp(this.moves)) {
                const voided = this.levelUpNewIngredient();

                if (voided.length) {
                    voidIngredientsIds.push(...voided);
                }
            } else {
                this.applySpell();
            }

            // Replace extra ingredient
            if (supply.isReplaceExtraIngredient(this.moves)) {
                const { addId, removeId } = supply.updateExtraIngredient();

                if (addId && removeId) {
                    score.addCurrentIngredient(addId, removeId);
    
                    if (!voidIngredientsIds.includes(removeId)) {
                        voidIngredientsIds.push(removeId);
                    }
                }
            }

            // Void all removed ingredients
            if (voidIngredientsIds.length) {
                grid.voidByIngredientId(voidIngredientsIds.length === 1
                    ? voidIngredientsIds[0]
                    : voidIngredientsIds
                );
            }

            grid.fillInWithNewIngredients();

            // Checks there's a minimum path if spell is minMoves.
            // If not Game over
            if (spell.currentMinMoves()) {
                const detected = grid.detectMinimumPath(true);
                
                if (!detected) {
                    notification.push('noMoves');
                }
            }

            eventsCentre.emit('updateDialogs');
            eventsCentre.emit('notificationsQueue');
        });

        // Shutdown scene
        this.events.once('shutdown', () => {
            this.input.removeListener('pointerup');
            this.input.keyboard.removeListener('keyup');
        });
    }

    update () {
        this.#debugInfoOnScreen();
    }

    collectSelected () {
        const {
            grid,
            score,
            spell,
            supply,
            basket,
            tree,
            notification,
        } = this;
        const removed = basket.untrackSelectedIngredients(0) || [];

        if (removed.length) {
            const { constants: { POINTS_TO_GAME_OVER } } = gameMechanics;

            removed.forEach(ingredient => {
                ingredient.setCollected();
                grid.voidSingleIngredient(ingredient);
            });

            basket.collectAvailable = false;
            score.add(removed[0].id, removed.length);
            spell.updateProbabilities(score.points);
            supply.updateProbabilities(score.amounts);
            tree.updateProbabilites(score.points);

            if (score.totalPoints >= POINTS_TO_GAME_OVER) {
                notification.push('pointsGameOver', { points: score.totalPoints });
            }

            eventsCentre.emit('newMove');
        }
    }

    levelUpNewIngredient () {
        const {
            tree,
            score,
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
            notification.push('newIngredient', { addId });

            supply.updateIngredientsSlots(slots);
            score.addCurrentIngredient(addId, removeId);

            voided.push(removeId);
        }

        return voided;
    }

    applySpell() {
        const { spell, notification } = this;
        const { name } = spell.pickEffect();

        if (name !== 'none') {
            notification.push('spell', { name });
        }

    }

    #createEnvironment () {
        const basement = this.add.image(BASEMENT_X, 0, 'main', 'basement');
        const staircase = this.add.image(STAIRCASE_X, 0, 'main', 'staircase');

        basement.setOrigin(0, 0);
        staircase.setOrigin(0, 0);
        
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
