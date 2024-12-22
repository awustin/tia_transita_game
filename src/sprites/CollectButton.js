import eventsCentre from "@objects/EventsCentre";
import {
    DIALOG_PANEL_X,
    DIALOG_PANEL_Y,
} from "@constants";

export default class CollectButton extends Phaser.GameObjects.Sprite
{
    #button = null;

    constructor(scene, x = 0, y = 0) {
        super(
            scene,
            DIALOG_PANEL_X + 611,
            DIALOG_PANEL_Y + 55,
            'ui',
            'collectButtonOff'
        ).setOrigin(0, 0)
        .setName('collectButton');

        this.scene.add.existing(this);
        this.setOff();

        this.on('pointerup', () => {
            if (this.state === 'on') {
                eventsCentre.emit('collectButtonClick');
            }
        });
    }

    setOn() {
        this.setInteractive({ cursor: 'pointer' });
        this.setFrame('collectButtonOn');
        this.setState('on');
    }

    setOff() {
        this.setFrame('collectButtonOff');
        this.setState('off');
    }

    setEnabled(value = true) {
        if (value) {
            this.setOn();
        } else {
            this.setOff();
        }
    }

    get enabled() {
        return this.state === 'on';
    }
}
