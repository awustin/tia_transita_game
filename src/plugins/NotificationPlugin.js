import ModalGroup from "@objects/ModalGroup";
import { selectById } from "@utils/data";
import {
    TEXT_BUTTON_QUIT,
    TEXT_MIN_MOVES,
    TEXT_NEW_INGREDIENT,
    TEXT_PAUSED,
    TEXT_BUTTON_CANCEL,
    TEXT_NO_MOVES,
    TEXT_POINTS_REACHED,
    TEXT_BLOCK_CELLS,
} from "@constants";

/**
 * Creates interactive notificiations on screen
 */
export default class NotificationPlugin extends Phaser.Plugins.BasePlugin
{
    #game = null;
    #queue = [];
    #current = {
        type: null,
        cancelCallback: Function.prototype,
    };

    constructor(pluginManager) {
        super(pluginManager);

        this.#game = pluginManager.game;
    }

    start() {
        this.#queue = [];
        this.#current = {
            type: null,
            cancelCallback: Function.prototype,
        };
    }

    push(type, params) {
        if (type) {
            this.#queue.push({ type, params });
        }
    }

    closeCurrent() {
        if (this.#current.type) {
            this.#current.cancelCallback();
            this.#current = {};
        }
    }

    onNewIngredient(ingredientId = null) {
        if (ingredientId) {
            const uiScene = this.#game.scene.getScene('ui');
            const { ingredients } = this.#game.cache.json.get('game');
            const { label } = selectById(ingredients.items, ingredientId);
            const modalGroup = new ModalGroup(uiScene);
    
            modalGroup.show({
                headerText: TEXT_NEW_INGREDIENT,
                bodyGameObject: uiScene.add.sprite(0, 0, 'ingredients', `ingredient${ingredientId}`),
                footerText: label,
            });
            modalGroup.animate();

            this.#current = {
                type: 'newIngredient',
                cancelCallback: () => modalGroup.destroy(true),
            };
        }
    }

    onPauseMenu({ onConfirm = Function.prototype, onCancel = Function.prototype }) {
        const uiScene = this.#game.scene.getScene('ui');
        const mainScene = this.#game.scene.getScene('main');
        const modalGroup = new ModalGroup(uiScene);

        mainScene.scene.pause();

        modalGroup.show({
            headerText: TEXT_PAUSED,
            withButtons: true,
            padTop: 20,
        });

        modalGroup.button(
            TEXT_BUTTON_QUIT,
            () => {
                mainScene.scene.resume();
                onConfirm();
            }
        ).setToLeft();

        modalGroup.button(
            TEXT_BUTTON_CANCEL,
            () => {
                mainScene.scene.resume();
                onCancel();
                modalGroup.destroy(true);
                this.#current = {
                    type: null,
                    cancelCallback: Function.prototype,
                }
            }
        ).setToRight();

        this.#current = {
            type: 'leaveMenu',
        }
    }

    onSpell(name) {
        if (name === 'minMoves') {
            const uiScene = this.#game.scene.getScene('ui');
            const modalGroup = new ModalGroup(uiScene);

            modalGroup.show({
                bodyText: TEXT_MIN_MOVES,
            });
            modalGroup.animate();

            this.#current = {
                type: 'spell/minMoves',
                cancelCallback: () => modalGroup.destroy(true),
            };
        }

        if (name === 'blockCells') {
            const uiScene = this.#game.scene.getScene('ui');
            const modalGroup = new ModalGroup(uiScene);

            modalGroup.show({
                bodyText: TEXT_BLOCK_CELLS,
            });
            modalGroup.animate();

            this.#current = {
                type: 'spell/blockCells',
                cancelCallback: () => modalGroup.destroy(true),
            };
        }
    }

    onNoMoves({ onConfirm = Function.prototype }) {
        const uiScene = this.#game.scene.getScene('ui');
        const modalGroup = new ModalGroup(uiScene);

        modalGroup.show({
            headerText: TEXT_NO_MOVES,
            withButtons: true,
            padTop: 20,
        });

        modalGroup.button(
            TEXT_BUTTON_QUIT,
            onConfirm
        ).setToCenter();

        this.#current = {
            type: 'leaveMenu',
        }
    }

    onPointsGameOver() {
        const uiScene = this.#game.scene.getScene('ui');
        const modalGroup = new ModalGroup(uiScene);

        modalGroup.show({
            bodyText: TEXT_POINTS_REACHED,
        });

        this.#current = {
            type: 'pointsGameOver',
        }
    }

    get current() {
        return this.#current;
    }

    get queue() {
        return this.#queue;
    }

    get firstIn() {
        return this.#queue.shift();
    }
}
