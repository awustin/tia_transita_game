import Mercuria from "@sprites/Mercuria";

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

        mercuria.setIdle();
        mercuria.speak('this will be destroyed in 2 seconds...', 2);
    }

    update() {
    }
}