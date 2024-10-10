import Phaser from "phaser";
import TiaTransitaGame from "@scenes/TiaTransitaGame";
import {
    WIDTH,
    HEIGHT,
} from "@constants";

new Phaser.Game({
    type: Phaser.WEBGL,
    scene: TiaTransitaGame,
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
