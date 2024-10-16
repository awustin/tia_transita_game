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
        this.speech.addSpeechBubble(1);
        this.speech.addSpeechBubble(1);
        this.speech.addSpeechBubble(2);
    }

    update() {
    }
}