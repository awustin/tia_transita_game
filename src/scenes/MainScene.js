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
        
        // Ingredients selected
        this.input.on('pointerup', (value, [ ingredient ]) => {
            if (ingredient?.collectable) {
                if (ingredient.isIdle()) {
                    // If idle, start or add to current selection
                    const valid = basket.isValidMove(ingredient);

                    if (valid) {
                        basket.trackIngredient(ingredient);
                        ingredient.setActive();
                    } else {
                        const untracked = basket.untrackAll();

                        untracked.forEach(ingredient => ingredient.setIdle());
                        basket.trackIngredient(ingredient);
                        ingredient.setActive();
                    }
                } else if (ingredient.isActive()) {
                    // If active, untrack and break current selection
                    const index = basket.selectedIndex(ingredient);

                    if (index >= 0) {
                        const untracked = basket.untrackSelectedIngredients(index);

                        untracked.forEach(ingredient => ingredient.setIdle());
                    } 
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

            // Grab new ingredient or pick a spell
            if (tree.isBranchLevelUp(this.moves)) {
                const voided = this.levelUpNewIngredient();

                if (voided.length) {
                    voidIngredientsIds.push(...voided);
                }
            } else {
                const { name } = spell.pickEffect();
        
                if (name !== 'none') {
                    notification.push('spell', { name });
                }
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

            if (!spell.currentResetBoard()) {
                grid.fillWithRandom();
            }

            eventsCentre.emit('updateDialogs');
            eventsCentre.emit('applySpell');
            eventsCentre.emit('updateUi');
        });

        // Apply spell
        eventsCentre.on('applySpell', () => {
            const {
                spell,
                grid,
                notification,
                supply,
            } = this;

            if (spell.previousBlockCells()) {
                grid.unblockIngredients();
            }

            if (spell.currentBlockCells()) {
                grid.blockIngredients(spell.pickMapBlockedCells());
            }

            if (spell.currentResetBoard()) {
                grid.voidAllIngredients();

                grid.fillWithMap(
                    spell.pickMapResetBoard(),
                    supply.getSlotsForMap()
                );
            }

            // Temporarily, only detect minimum paths for minMoves or blockCells
            if (spell.currentMinMoves() || spell.currentBlockCells()) {
                const detected = grid.detectMinimumPath(spell.currentMinMoves());
                
                if (!detected) {
                    notification.push('noMoves');
                }
            }
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
