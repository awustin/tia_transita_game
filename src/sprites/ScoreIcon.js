import {
    DIALOG_PANEL_X,
    DIALOG_PANEL_Y,
} from "@constants";

export default class ScoreIcon extends Phaser.GameObjects.Sprite
{
    constructor(scene, x = 0, y = 0) {
        super(
            scene,
            DIALOG_PANEL_X + 557,
            DIALOG_PANEL_Y + 82,
            'ui',
            'iconLabour'
        ).setOrigin(0, 0)
        .setName('scoreIcon');

        this.scene.add.existing(this);
        this.setLabour();
    }

    setLabour() {
        this.setFrame('iconLabour');
        this.setState('labour');
    }

    setNecromancy() {
        this.setFrame('iconNecromancy');
        this.setState('necromancy');
    }

    setAstrology() {
        this.setFrame('iconAstrology');
        this.setState('astrology');
    }
}
