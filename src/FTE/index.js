import DisplayTransform from './displayTransform.js';
import Mouse from './mouse.js';

export default class FTE {
    constructor() {
        this.ctx = null;
        this.canvas = window.document.createElement('canvas');
        this.timer = 0;
        this.displayTransform = null;
        this.mouse = new Mouse();
        this.lastCalledTime = new Date();
        this.fps = 0;
        this.properFPS = 0;
        this.elapsed = 0;
    }
    init(e) {
        // attach events
        window.addEventListener('resize', this.resize.bind(this));
        // init html
        this.initHtml('greedy');
        // resize
        this.resize();

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    }

    initHtml(id) {
        if (!id || !/^[A-Za-z]+[\w\-]*$/.test(id)) throw new Error(`Invalid id specified= ${id}. Default rules, minus '.' and '-'.`);

        let canvas = window.document.createElement('canvas');
        canvas.id = id;

        this.canvas = document.body.appendChild(canvas);

        this.ctx = this.canvas.getContext('2d');

        this.displayTransform = new DisplayTransform(this.ctx);


        // set the canvas origin (0,0) to center canvas
        // All coordinates to the left of center canvas are negative
        // All coordinates below center canvas are negative
        // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        this.setupMouse();
        this.update();
    }

    resize() {
        this.canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
        this.canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
        this.displayTransform.ox = this.canvas.width / 2;
        this.displayTransform.oy = this.canvas.height / 2;
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
            e.preventDefault();
        }, false);
    }

    update() {
        /**
         * FPS
         */
        if (!this.lastCalledTime) {
            this.lastCalledTime = Date.now();
            this.fps = 0;
        }
        let delta = (Date.now() - this.lastCalledTime);
        this.elapsed += delta;
        if (this.elapsed >= 1000) {
            this.elapsed = 0;
            this.properFPS = this.fps;
        }

        this.lastCalledTime = Date.now();
        delta /= 1000;
        this.fps = 1 / delta;
        /**
         * timer
         */
        this.timer += 1; // update timere
        // update the transform
        this.displayTransform.update(this.mouse);
        // set home transform to clear the screen
        this.displayTransform.setHome();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.displayTransform.setTransform();

        this.draw();
        // this.drawLines();
        this.drawMouseLines();

        if (this.mouse.buttonRaw === 4) { // right click to return to home
            this.displayTransform.x = 0;
            this.displayTransform.y = 0;
            this.displayTransform.scale = 1;
            this.displayTransform.rotate = 0;
            this.displayTransform.ox = this.canvas.width / 2;
            this.displayTransform.oy = this.canvas.height / 2;
        }
        // reaquest next frame
        requestAnimationFrame(this.update.bind(this));
    }

    draw() {
        this.ctx.fillStyle = '#b4cacf';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 50, 0, 2 * Math.PI, false);
        this.ctx.fill();
        // this.ctx.stroke();
        // this.ctx.fillRect(-50, -50, 100, 100);
    }

    drawLines() {
        let ctx = this.ctx;

        var spacing = 20;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#555';
        ctx.beginPath();

        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.canvas.height / 2);

        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.canvas.height / 2);

        ctx.moveTo(0, 0);
        ctx.lineTo(this.canvas.width / 2, 0);

        ctx.moveTo(0, 0);
        ctx.lineTo(-this.canvas.width / 2, 0);


        ctx.stroke();
    }

    drawMouseLines() {
        let ctx = this.ctx;
        let mouse = this.mouse;
        let canvas = this.canvas;
        var spacing = 20;
        ctx.lineWidth = .1;
        ctx.strokeStyle = '#e1e5e6';
        ctx.beginPath();

        ctx.moveTo(mouse.rx, mouse.ry);
        ctx.lineTo(mouse.rx, mouse.ry - mouse.y);

        ctx.moveTo(mouse.rx, mouse.ry);
        ctx.lineTo(mouse.rx, canvas.height - mouse.y + mouse.ry);

        ctx.moveTo(mouse.rx, mouse.ry);
        ctx.lineTo(mouse.rx - mouse.x, mouse.ry);

        ctx.moveTo(mouse.rx, mouse.ry);
        ctx.lineTo(canvas.width - mouse.x + mouse.rx, mouse.ry);

        ctx.strokeStyle = '#222';
        this.ctx.fillStyle = '#222';

        ctx.fillText(`${this.properFPS.toFixed(2)}`, mouse.rx + 5, mouse.ry - 15);
        ctx.fillText(`x:${mouse.rx.toFixed(0)},y:${mouse.ry.toFixed(0)}`, mouse.rx + 5, mouse.ry - 5);

        ctx.stroke();
    }
}