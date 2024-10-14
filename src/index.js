import Phaser from "phaser";
import MainScene from "@scenes/MainScene";
import IntroScene from "@scenes/IntroScene";
import EndScene from "@scenes/EndScene";
import BasketPlugin from "@plugins/BasketPlugin";
import SupplyPlugin from "@plugins/SupplyPlugin";
import ScorePlugin from "@plugins/ScorePlugin";
import SpellPlugin from "@plugins/SpellPlugin";
import BoardPlugin from "@plugins/BoardPlugin";
import {
    WIDTH,
    HEIGHT,
    initialState,
} from "@constants";

const {
    ingredientsProbabilities,
    ingredientsProperties,
    spells,
} = initialState;

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
            },
            {
                key: 'supply',
                plugin: SupplyPlugin,
                start: true,
                data: ingredientsProbabilities,
            },
            {
                key: 'score',
                plugin: ScorePlugin,
                start: true,
                data: ingredientsProperties,
            },
            {
                key: 'spell',
                plugin: SpellPlugin,
                start: true,
                data: spells,
            },
            {
                key: 'board',
                plugin: BoardPlugin,
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
