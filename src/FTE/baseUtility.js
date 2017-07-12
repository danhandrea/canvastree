export default class BaseUtility {
    constructor(ctx) {
        /**
         * context
         */
        this.ctx = ctx;
        this.elapsed = {};
        /**
         * last frame time
         */
        this.lastFrameTime = Date.now();
    }

    every(seconds, tag, action) {
        /**
         * just make sure the time elapsed for this tag is initialised;
         */
        if (this.elapsed[tag] === undefined)
            this.elapsed[tag] = 0;
        /**
         * compute delta time
         */
        let delta = (Date.now() - this.lastFrameTime);
        /**
         * increment elapsed time
         */
        this.elapsed[tag] += delta;
        /**
         * time's up
         */
        if (this.elapsed[tag] >= seconds * 1000) {
            /**
             * reset
             */
            this.elapsed[tag] = 0;
            /**
             * perform action
             */
            action();
        }
    }
}