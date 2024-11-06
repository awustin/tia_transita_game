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
    }

    show({
        headerText = null,
        bodyGameObject = null,
        footerText = null,
        withButtons = false,
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

        if (footerText && !withButtons) {
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

        if (withButtons) {
            // Add buttons sprites
        }

        this.children.iterate(child => {
            this.scene.add.tween({
                targets: child,
                y: child.y + 10,
                duration: 600,
                ease: 'quad.out'
            });   
        });
    }
}
