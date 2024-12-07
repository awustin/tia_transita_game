import eventsCentre from "@objects/EventsCentre";
import Mercuria from "@sprites/Mercuria";
import DialogController from "@objects/DialogController";

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
        const controller = new DialogController(this);

        mercuria.setIdle();
        controller.show();
        controller.updateCurrentDialogs(supply.currentIngredients);
        controller.setSpeakTimeline({
            secondsAt: 20,
            duration: 5,
        });

        eventsCentre.on('updateDialogs', () => {
            controller.updateCurrentDialogs(supply.currentIngredients);
        });

        this.events.once('shutdown', () => {
            eventsCentre.removeAllListeners();
        });
    }

    update() {
    }
}