import eventsCentre from "@objects/EventsCentre";

export default class UIScene extends Phaser.Scene
{
    basket = null;
    controls = null;

    constructor() {
        super('ui');
    }

    init() {
        this.basket = this.plugins.get('basket');
        this.controls = this.plugins.get('controls');
    }

    preload() {
    }

    create() {
        const { controls } = this;

        controls.addCollectButton(() => eventsCentre.emit('uiCollect'));
        controls.addCloseButton();
        controls.addSoundToggle();
    }

    update() {
        const {
            controls,
            basket,
        } = this;
    
        controls.showCollectButton(basket.collectAvailable);
    }
}