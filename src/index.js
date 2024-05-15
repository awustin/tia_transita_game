import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import ResultsEffects from './classes/ResultsEffects';
import IngredientsGameGrid from './classes/IngredientsGameGrid';
import Ingredient from './classes/Ingredient';
import IngredientsBasket from './classes/IngredientsBasket';

try {
    class IngredientsOrchardGame extends Phaser.Scene {
        preload () {
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
    
        create () {
            // TEST DATA
            this.add.ingredientsPool = new IngredientsPool([
                {id: 1, probability: 1/4},
                {id: 2, probability: 1/4},
                {id: 3, probability: 1/4},
                {id: 4, probability: 1/4},
            ]);
            let grid = new IngredientsGameGrid({
                scene: this,
                offsetX: this.game.config.width / 2,
                offsetY: this.game.config.height / 2
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

            const i = new IngredientsBasket(this);
           
            this.input.on('pointerup', (value, gameObject) => {
                const objectClass = gameObject[0]?.constructor.name || '';

                if (objectClass === 'Ingredient') {
                    const ingredient = gameObject[0];
                    const index = i.selectedIndex(ingredient);

                    if (index >= 0) {
                        i.removeSelectedIngredients(index).forEach(ingredient => ingredient.setIdle());
                    } else {
                        i.addSelectedIngredient(ingredient);
                    }
                }
            })
        }
    }
    
    const config = {
        type: Phaser.AUTO,
        scene: IngredientsOrchardGame,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 910
        },
    };
    
    const game = new Phaser.Game(config);
} catch (e) {
    throw new Error(e);
}