import Phaser from "phaser";
import MainScene from "@scenes/MainScene";
import IntroScene from "@scenes/IntroScene";
import EndScene from "@scenes/EndScene";
import BasketPlugin from "@plugins/BasketPlugin";
import {
    WIDTH,
    HEIGHT,
} from "@constants";

new Phaser.Game({
    type: Phaser.WEBGL,
    scene: [
        IntroScene,
        MainScene,
        EndScene,
    ],
    plugins: {
        global: [
            {
                key: 'basket',
                plugin: BasketPlugin,
                start: true,
            }
        ]
    },
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
