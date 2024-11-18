import eventsCentre from "@objects/EventsCentre";

export default class UIScene extends Phaser.Scene
{
    score = null;
    basket = null;
    controls = null;
    notification = null;
    isNotificationShowing = false;

    constructor() {
        super('ui');
    }

    init() {
        this.score = this.plugins.get('score');
        this.basket = this.plugins.get('basket');
        this.controls = this.plugins.get('controls');
        this.notification = this.plugins.get('notification');
    }

    preload() {
    }

    create() {
        const {
            controls,
            notification,
        } = this;

        // Collect selected on button click
        controls.addCollectButton(() => eventsCentre.emit('collectButtonClick'));
        // Restart game on close button click
        controls.addCloseButton(() => {
            if (!this.isNotificationShowing) {
                this.showGameMenu();
            }
        });
        // Todo - toggle sound ON / OFF
        controls.addSoundToggle();

        // Loop through notifications queue
        eventsCentre.on('notificationsQueue', () => {
            if (notification.queue.length) {
                this.scene.pause('main');
                this.showNextNotification();
            }
        });

        this.input.on('pointerup', () => {
            if (this.isNotificationShowing && notification.current.type !== 'leaveMenu') {
                if (notification.current.type === 'pointsGameOver') {
                    this.showPointsReached();
                } else {
                    notification.closeCurrent();
    
                    // Next notification
                    if (notification.queue.length) {
                        // Add delay
                        this.time.delayedCall(500, () => {
                            this.showNextNotification();
                        });
                    } else {
                        this.isNotificationShowing = false;
                        this.scene.resume('main');
                    }
                }
            }
        });
    }

    update() {
        const {
            controls,
            basket,
        } = this;

        controls.showCollectButton(basket.collectAvailable);
    }

    showNextNotification() {
        const { notification } = this;
        const { type, params } = notification.firstIn;

        this.isNotificationShowing = true;

        switch(type) {
            case 'pointsGameOver':
                notification.onPointsGameOver();

                break;
            case 'spell':
                const { name } = params;

                notification.onSpell(name);
                break;
            case 'newIngredient':
                const { addId } = params;

                notification.onNewIngredient(addId);
                break;
            case 'noMoves':
                this.showNoMovesMenu();
                break;
            default:
                break;
        }
    }

    showGameMenu() {
        const {
            score,
            notification,
        } = this;
        const gameScore = score.points;

        this.isNotificationShowing = true;

        notification.onPauseMenu({
            onConfirm: () => {
                this.scene.stop('main');
                this.scene.stop('dialogs');
        
                this.plugins.stop('score');
                this.plugins.stop('supply');
                this.plugins.stop('speech');
                this.plugins.stop('basket');
                this.plugins.stop('notification');
                this.plugins.stop('board');
                this.plugins.stop('spell');
                this.plugins.stop('controls');
                eventsCentre.removeAllListeners();
        
                this.scene.start('intro', { isRestart: true, points: gameScore });
            },
            onCancel: () => this.isNotificationShowing = false,
        });
    }

    showNoMovesMenu() {
        const {
            score,
            notification,
        } = this;
        const gameScore = score.points;

        notification.onNoMoves({
            onConfirm: () => {
                this.scene.stop('main');
                this.scene.stop('dialogs');
        
                this.plugins.stop('score');
                this.plugins.stop('supply');
                this.plugins.stop('speech');
                this.plugins.stop('basket');
                this.plugins.stop('notification');
                this.plugins.stop('board');
                this.plugins.stop('spell');
                this.plugins.stop('controls');
                eventsCentre.removeAllListeners();
        
                this.scene.start('intro', { isRestart: true, points: gameScore });
            },
        });
    }
    
    showPointsReached() {
        this.scene.stop('main');
        this.scene.stop('dialogs');
        this.scene.stop('ui');
        this.scene.start('end');
    }
}