import {
    DIALOG_PANEL_X,
    DIALOG_PANEL_Y,
} from "@constants";

export default class EffectIcon extends Phaser.GameObjects.Sprite
{
    constructor(scene, x = 0, y = 0) {
        super(
            scene,
            DIALOG_PANEL_X + 487,
            DIALOG_PANEL_Y + 82,
            'ui',
            'iconNoEffect'
        ).setOrigin(0, 0)
        .setName('scoreIcon');

        this.scene.add.existing(this);
        this.setNone();
    }

    setNone() {
        this.setFrame('iconNoEffect');
        this.setState('none');
    }

    setMinMoves() {
        this.setFrame('iconMinMoves');
        this.setState('minMoves');
    }
}
