import {
    MERCURIA_X,
    MERCURIA_Y,
} from "@constants";

export default class Mercuria extends Phaser.GameObjects.Sprite
{
    #speech = null;
    #timeoutId = null;
    #current = '';

    constructor(scene) {
        const plugin = scene.plugins.get('speech');

        if (!plugin) {
            throw {
                message: 'MercuriaNPC needs global plugin "speech" to work',
                code: 'C15'
            };
        }

        super(
            scene,
            MERCURIA_X,
            MERCURIA_Y,
            'main',
            'mercuria_idle1',
        );

        this.anims.create({
            key: 'mercuria_idle',
            frames: this.anims.generateFrameNames('main', {
                prefix: 'mercuria_idle',
                start: 1,
                end: 2,
            }),
            frameRate: 2,
            repeat: -1,
        });
        this.setOrigin(0, 0);
        this.scene.add.existing(this);
        this.#speech = plugin;
    }

    setIdle() {
        this.anims.play('mercuria_idle');
    }

    speak(message = '', seconds = 5) {
        this.#destroyComment();
        this.#current = this.#speech.comment(message);

        const timeoutId = setTimeout(() => this.#destroyComment(), seconds * 2000);

        this.#timeoutId = timeoutId;
    }

    mute() {
        this.#destroyComment();
    }

    //--------------
    // Private
    //--------------

    #destroyComment() {
        if (this.#current) {
            this.#current.destroy(true);
        }

        if (this.#timeoutId) {
            clearTimeout(this.#timeoutId);
            this.#timeoutId = null
        }
    }
}
