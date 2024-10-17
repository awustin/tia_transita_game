export default class DialogsScene extends Phaser.Scene
{
    speech = null;

    constructor() {
        super('dialogs');
    }

    init() {
        this.speech = this.plugins.get('speech');
    }

    preload() {
    }

    create() {
        setTimeout(() => {
            this.speech.add(1);
        }, 1000);
        setTimeout(() => {
            this.speech.add(2);
        }, 3000);
        setTimeout(() => {
            this.speech.removeCurrent();
        }, 10000);
        setTimeout(() => {
            this.speech.add(1);
            console.log(this.children);
        }, 12000);
    }

    update() {
    }
}