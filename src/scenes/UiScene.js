import eventsCentre from "@objects/EventsCentre";

export default class UIScene extends Phaser.Scene
{
    score = null;
    basket = null;
    controls = null;
    notification = null;

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
        const { controls } = this;

        // Collect selected on button click
        controls.addCollectButton(() => eventsCentre.emit('collectButtonClick'));

        // Restart game on close button click
        controls.addCloseButton(() => this.teardownGame());

        controls.addSoundToggle();
    }

    update() {
        const {
            controls,
            basket,
        } = this;

        controls.showCollectButton(basket.collectAvailable);
    }

    teardownGame() {
        const {
            score,
            notification,
        } = this;
        const gameScore = score.points;

        notification.onPauseMenu({
            onQuit: () => {
                console.log('quit');

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
            onCancel: () => console.log('resume'),
        });
    }
}