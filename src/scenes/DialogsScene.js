import eventsCentre from "@objects/EventsCentre";
import Mercuria from "@sprites/Mercuria";
import DialogSequencer from "@objects/DialogSequencer";

export default class DialogsScene extends Phaser.Scene
{
    speech = null;
    supply = null;

    constructor() {
        super('dialogs');
    }

    init() {
        this.speech = this.plugins.get('speech');
        this.supply = this.plugins.get('supply');
    }

    create() {
        const { supply } = this;
        const mercuria = new Mercuria(this);
        const sequencer = new DialogSequencer(this);

        mercuria.setIdle();
        sequencer.updateCurrentDialogs(supply.currentIngredients);

        sequencer.setSpeakTimeline({
            onSpeak: (message => mercuria.speak(message, 5)).bind(this),
            secondsAt: 15,
        });

        eventsCentre.on('updateDialogs', () => {
            sequencer.updateCurrentDialogs(supply.currentIngredients);
        });

        this.events.once('shutdown', () => {
            eventsCentre.removeAllListeners();
        });
    }

    update() {
    }
}