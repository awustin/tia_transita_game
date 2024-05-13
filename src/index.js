import IngredientsPool from './classes/IngredientsPool';
import BoardMonitor from './classes/BoardMonitor';
import ResultsAccumulator from './classes/ResultsAccumulator';
import Ingredient from './classes/Ingredient';

try {
    class Example extends Phaser.Scene
    {
        preload ()
        {
            this.load.setBaseURL('https://labs.phaser.io');
    
            this.load.image('sky', 'assets/skies/space3.png');
            this.load.image('ingredient_1', require('../assets/sprites/ingredient_1.png'));
        }
    
        create ()
        {
            this.add.image(400, 300, 'sky');
            let ingredientsGroup = this.add.group();

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    ingredientsGroup.add(new Ingredient(
                        1,
                        [i,j],
                        { scene:this }
                    ));
                }
            }

            Phaser.Actions.GridAlign(ingredientsGroup.getChildren(), {
                width: 5,
                cellWidth: game.config.width / 10,
                cellHeight: game.config.height / 10,
                x: 230,
                y: 40
            });
        }
    }
    
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: Example,
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