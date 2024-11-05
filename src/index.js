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
import BoardPlugin from "@plugins/BoardPlugin";
import ControlsPlugin from "@plugins/ControlsPlugin";
import SpeechBubblesPlugin from "@plugins/SpeechBubblesPlugin";
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
        UiScene,
        DialogsScene,
        EndScene,
    ],
    plugins: {
        global: [
            {
                key: 'basket',
                plugin: BasketPlugin,
                start: true,
            },
            {
                key: 'supply',
                plugin: SupplyPlugin,
            },
            {
                key: 'score',
                plugin: ScorePlugin,
            },
            {
                key: 'spell',
                plugin: SpellPlugin,
            },
            {
                key: 'board',
                plugin: BoardPlugin,
                start: true,
            },
            {
                key: 'controls',
                plugin: ControlsPlugin,
                start: true,
                sceneKey: 'main',
            },
            {
                key: 'speech',
                plugin: SpeechBubblesPlugin,
                start: true,
            },
            {
                key: 'notification',
                plugin: NotificationPlugin,
                start: true,
            }
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
