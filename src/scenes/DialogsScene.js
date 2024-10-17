export default class DialogsScene extends Phaser.Scene
{
    speech = null;

    constructor() {
        super('dialogs');
    }

    init() {
        this.speech = this.plugins.get('speech');
    }

    preload() {
    }

    create() {
        const { speech } = this;
        const arr = [1,2,3,4];
        let index = 0;

        setInterval(() => {
            speech.add(arr[index]);

            if (index === 3) {
                index = 0;
            } else {
                index++;
            }
        }, 3000);
    }

    update() {
    }
}