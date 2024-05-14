import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import ResultsEffects from './classes/ResultsEffects';
import IngredientsGameGrid from './classes/IngredientsGameGrid';
import Ingredient from './classes/Ingredient';

try {
    class IngredientsOrchardGame extends Phaser.Scene
    {
        preload ()
        {
            this.load.on('progress', value => console.log(value));
            this.load.on('complete', () => console.log('Loaded!'));
            this.load.spritesheet({
                key: 'ingredient',
                url: 'assets/sprites/fantasy_tileset.png',
                frameConfig: {
                    frameWidth: 32,
                    frameHeight: 32,
                    startFrame: 32,
                    endFrame: 56
                }
            });

            this.registry.effectsConfig = {
                runningEffect: 'none',
                effects: {
                    'blockCells': {id: 1, params: null},
                    'maxMoves': {id: 2, params: null},
                    'changeBoard': {id: 3, params: null},
                    'resetBoard': {id: 4, params: null},
                }
            }
        }
    
        create ()
        {
            // TEST DATA
            this.add.ingredientsPool = new IngredientsPool([
                {id: 1, probability: 1/4},
                {id: 2, probability: 1/4},
                {id: 3, probability: 1/4},
                {id: 4, probability: 1/4},
            ]);
            let grid = new IngredientsGameGrid({
                scene: this,
                x: 230,
                y: 40
            })

            // let board = new BoardMonitor([
            //     [1,2,1,2],
            //     [2,3,1,3],
            //     [1,1,4,4],
            //     [4,2,1,3],
            // ])
            // let results = new ResultsAccumulator({
            //     1: {labour: 1, astrology: 0, necromancy: 0},
            //     2: {labour: 0, astrology: 1, necromancy: 0},
            //     3: {labour: 0, astrology: 0, necromancy: 1},
            //     4: {labour: 2, astrology: 0, necromancy: 0},
            // });
            // let effects = new ResultsEffects(this);
        }
    }
    
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: IngredientsOrchardGame,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        }
    };
    
    const game = new Phaser.Game(config);
} catch (e) {
    throw new Error(e);
}