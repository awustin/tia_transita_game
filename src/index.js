import Phaser from "phaser";
import MainScene from "@scenes/MainScene";
import UiScene from "@scenes/UiScene";
import IntroScene from "@scenes/IntroScene";
import EndScene from "@scenes/EndScene";
import DialogsScene from "@scenes/DialogsScene";
import BasketPlugin from "@plugins/BasketPlugin";
import SupplyPlugin from "@plugins/SupplyPlugin";
import ScorePlugin from "@plugins/ScorePlugin";
import SpellPlugin from "@plugins/SpellPlugin";
import ControlsPlugin from "@plugins/ControlsPlugin";
import NotificationPlugin from "@plugins/NotificationPlugin";
import {
    WIDTH,
    HEIGHT,
} from "@constants";

new Phaser.Game({
    type: Phaser.WEBGL,
    scene: [
        IntroScene,
        MainScene,
        DialogsScene,
        UiScene,
        EndScene,
    ],
    plugins: {
        global: [
            { key: 'basket', plugin: BasketPlugin },
            { key: 'supply', plugin: SupplyPlugin },
            { key: 'score', plugin: ScorePlugin },
            { key: 'spell', plugin: SpellPlugin },
            { key: 'controls', plugin: ControlsPlugin },
            { key: 'notification', plugin: NotificationPlugin }
        ],
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
