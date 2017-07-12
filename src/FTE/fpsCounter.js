import BaseUtility from './baseUtility.js';

export default class FpsCounter extends BaseUtility {
    constructor(ctx) {
        super(ctx);
        /**
         * fps
         */
        this.fps = 0;
        /**
         * fps values
         * used for computing average fps
         */
        this.fpsValues = [];
        /**
         * this array will contain last n fps values
         */
        this.averageFPS = 0;
    }

    update() {
        /**
         * FPS
         */
        this.fps = 1 / ((Date.now() - this.lastFrameTime) / 1000);
        this.fpsValues.push(this.fps);

        this.every(1, 'averageFPS', () => {
            this.averageFPS = (this.fpsValues.reduce((a, b) => a + b) / this.fpsValues.length).toFixed(0);
            this.fpsValues = [];
        });
        /**
         * set last frame time
         * used in every
         */
        this.lastFrameTime = Date.now();
    }
}