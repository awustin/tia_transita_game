import Mercuria from "@sprites/Mercuria";
import DialogSequencer from "@objects/DialogSequencer";
// Todo: debug error
import Database from 'sqlite3';

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
        //Todo - create spritesheet for dialog scene
        this.load.atlas('main', '../assets/atlas/main.png', '../assets/atlas/main.json');
    }

    create() {
        const mercuria = new Mercuria(this);
        const sequencer = new DialogSequencer(this);
        mercuria.setIdle();

        sequencer.setSpeakTimeline({
            onSpeak: (message => mercuria.speak(message, 5)).bind(this),
            secondsAt: 15,
        });
    }

    update() {
    }
}