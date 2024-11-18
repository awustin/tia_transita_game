import Button from "@sprites/Button";
import {
    MODAL_H,
    MODAL_W,
    MODAL_Y,
    MODAL_X,
    STYLE_MODAL_TEXT,
    BUTTON_W,
    BUTTON_H,
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
        bodyText = null,
        bodyGameObject = null,
        footerText = null,
        padTop = 0,
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
                    y + 20 + padTop,
                    headerText,
                    STYLE_MODAL_TEXT
                )
                .setWordWrapWidth(MODAL_W - 5)
                .setOrigin(0.5, 0.5)
                .setToTop()
            );
        }

        if (bodyGameObject && !bodyText) {
            this.add(
                bodyGameObject
                .setX(x + MODAL_W / 2)
                .setY(y + MODAL_H / 2)
                .setToTop()
                .setOrigin(0.5, 0.5)
            );
        }

        if (bodyText) {
            this.add(
                this.scene.add.text(
                    x + MODAL_W / 2,
                    y + MODAL_H / 2,
                    bodyText,
                    STYLE_MODAL_TEXT
                )
                .setWordWrapWidth(MODAL_W - 5)
                .setOrigin(0.5, 0.5)
                .setToTop()
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
        const offsetX = MODAL_X + BUTTON_W / 2;

        const button = new Button(this.scene, {
            label: text,
            onClick,
            x: offsetX,
            y: MODAL_Y + BUTTON_H / 2 + 84
        });

        this.add(button);

        return {
            setToLeft: () => button.setX(offsetX + 52),
            setToRight: () => button.setX(offsetX + 208),
            setToCenter: () => button.setX(offsetX + MODAL_W / 3),
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
