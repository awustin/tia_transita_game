import Phaser from "phaser";
import IngredientsOrchardGame from "@scenes/IngredientsOrchardGame";
import {
    WIDTH,
    HEIGHT,
} from "@constants";

new Phaser.Game({
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
