import Mercuria from "@sprites/Mercuria";
import DialogSequencer from "@objects/DialogSequencer";
import game from "../config/game.json";
import { join } from "../utils/data";

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

        const ingredients = game.ingredients;
        const dialogs = game.dialogs;
        console.log({ ingredients, dialogs });
        console.log(join({
            left: dialogs.items,
            leftOn: 'ingredientId',
            right: ingredients.items,
            rightOn: 'id',
            nameAs: 'ingredient',
        }));

    }

    update() {
    }
}