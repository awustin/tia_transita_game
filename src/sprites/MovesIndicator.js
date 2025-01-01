import {
    DIALOG_PANEL_X,
    DIALOG_PANEL_Y,
} from "@constants";
import { tree as treeMechanics } from "@utils/mechanics";

export default class MovesIndicator extends Phaser.GameObjects.Sprite
{
    constructor(scene, x = 0, y = 0) {
        super(
            scene,
            DIALOG_PANEL_X + 471,
            DIALOG_PANEL_Y + 104,
            'ui',
            'movesIndicator0'
        ).setOrigin(0, 0)
        .setName('movesIndicator');

        this.scene.add.existing(this);
    }
    
    setMoves(moves = 0) {
        const { constants: {
            MOVES_CHECK,
        } } = treeMechanics;
        const frames = 7;
        const pointer = Math.floor((moves % MOVES_CHECK) / MOVES_CHECK * frames);

        this.setFrame(`movesIndicator${pointer}`);
    }
}
