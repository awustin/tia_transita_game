import IngredientsOrchardGame from "@scenes/IngredientsOrchardGame";
import {
    WIDTH,
    HEIGHT,
} from "@constants";

const game = new Phaser({
    type: Phaser.WEBGL,
    scene: IngredientsOrchardGame,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH,
        height: HEIGHT
    }
});
