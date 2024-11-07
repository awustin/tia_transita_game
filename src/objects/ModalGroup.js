import Button from "@sprites/Button";
import {
    MODAL_H,
    MODAL_W,
    MODAL_Y,
    MODAL_X,
    STYLE_MODAL_TEXT,
} from "@constants";

export default class ModalGroup extends Phaser.GameObjects.Group
{
    constructor(scene) {
        super(scene);

        this.setName('modalGroup');
        this.scene.add.existing(this);
    }

    show({
        headerText = null,
        bodyGameObject = null,
        footerText = null,
    }) {
        const y = MODAL_Y - 10;
        const x = MODAL_X;

        this.add(
            this.scene.add.sprite(x, y, 'main', 'modal_generic').setOrigin(0, 0).setToTop()
        );

        if (headerText) {
            this.add(
                this.scene.add.text(
                    x + MODAL_W / 2,
                    y + 20,
                    headerText,
                    STYLE_MODAL_TEXT
                )
                .setWordWrapWidth(MODAL_W - 5)
                .setOrigin(0.5, 0.5)
                .setToTop()
            );
        }

        if (bodyGameObject) {
            this.add(
                bodyGameObject
                .setX(x + MODAL_W / 2)
                .setY(y + MODAL_H / 2)
                .setToTop()
                .setOrigin(0.5, 0.5)
            );
        }

        if (footerText) {
            this.add(
                this.scene.add.text(
                    x + MODAL_W / 2,
                    y + MODAL_H - 20,
                    footerText,
                    STYLE_MODAL_TEXT
                )
                .setWordWrapWidth(MODAL_W - 5)
                .setOrigin(0.5, 0.5)
                .setToTop()
            )
        }
    }

    button(text = '', onClick = Function.prototype) {
        const buttonSprite = new Button(this.scene, MODAL_X, MODAL_Y + 84);
        // Todo - finish text
        // const label = this.scene.add.text(
        //     x + MODAL_W / 2,
        //     y + 20,
        //     headerText,
        //     STYLE_MODAL_TEXT
        // )
        // .setWordWrapWidth(MODAL_W - 5)
        // .setOrigin(0.5, 0.5)
        // .setToTop();

        this.add(buttonSprite.setToTop());
        // this.add(label);

        return {
            setToLeft: () => buttonSprite.setX(MODAL_X + 52),
            setToRight: () => buttonSprite.setX(MODAL_X + 208),
            setToCenter: () => buttonSprite.setOrigin(0.5, 0.5).setX(MODAL_X + MODAL_W / 2),
        }
    }

    animate() {
        this.children.iterate(child => {
            this.scene.add.tween({
                targets: child,
                y: child.y + 10,
                duration: 500,
                ease: 'quad.out'
            });   
        });
    }
}
