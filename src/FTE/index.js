import DisplayTransform from './displayTransform.js';
import Mouse from './mouse.js';

export default class FTE {
    constructor() {
        this.ctx = null;
        this.canvas = window.document.createElement('canvas');
        this.timer = 0;
        this.displayTransform = null;
        this.mouse = new Mouse();
    }
    init(e) {
        // attach events
        window.addEventListener('resize', this.resize.bind(this));
        // init html
        this.initHtml('greedy');
        // resize
        this.resize();
    }

    initHtml(id) {
        if (!id || !/^[A-Za-z]+[\w\-]*$/.test(id)) throw new Error(`Invalid id specified= ${id}. Default rules, minus '.' and '-'.`);

        let canvas = window.document.createElement('canvas');
        canvas.id = id;

        this.canvas = document.body.appendChild(canvas);

        this.ctx = this.canvas.getContext('2d');

        this.displayTransform = new DisplayTransform(this.ctx);

        this.setupMouse();
    }

    resize() {
        this.canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
        this.canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
        // Resizing the canvas element will automatically clear all drawings off the canvas.
        // this.draw();
    }

    setupMouse() {
        this.canvas.addEventListener('mousemove', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('mousedown', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('mouseup', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('mouseout', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('mouseover', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('mousewheel', this.mouse.move.bind(this.mouse));
        this.canvas.addEventListener('DOMMouseScroll', this.mouse.move.bind(this.mouse)); // fire fox

        this.canvas.addEventListener("contextmenu", function (e) {
            this.canvas.preventDefault();
        }, false);
    }

    update() {
        this.timer += 1; // update timere
        // update the transform
        this.displayTransform.update(this.mouse);
        // set home transform to clear the screem
        this.displayTransform.setHome();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.displayTransform.setTransform();

        this.draw();

        if (this.mouse.buttonRaw === 4) { // right click to return to homw
            this.displayTransform.x = 0;
            this.displayTransform.y = 0;
            this.displayTransform.scale = 1;
            this.displayTransform.rotate = 0;
            this.displayTransform.ox = 0;
            this.displayTransform.oy = 0;
        }
        // reaquest next frame
        requestAnimationFrame(this.update.bind(this));
    }

    draw() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(20, 20, 100, 100);
    }
}