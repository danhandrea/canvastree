import DisplayTransform from './displayTransform.js';
import Mouse from './mouse.js';
import FpsCounter from './fpsCounter.js';
import Node from '../family/node.js';
import Point from '../family/point.js';
import {
    data
} from '../data/test1.js';
import transform from '../family/transform.js';
import Person from '../family/person.js';

const DEFAULT_SIZE = 50;
const CENTER = new Point(0, 0);

export default class FTE {
    constructor() {
        this.ctx = null;
        this.canvas = window.document.createElement('canvas');
        this.timer = 0;
        this.displayTransform = null;
        this.mouse = new Mouse();
        this.fpsCounter = new FpsCounter(this.ctx);
        this.root = null;
        this.nodes = [];
        this.mouseOverNode = null;
        this.dataClient = null;
    }
    init(dataClient) {
        // attach events
        window.addEventListener('resize', this.resize.bind(this));
        // init html
        this.initHtml('greedy');
        // init context
        this.initContext();
        // init data
        this.dataClient = dataClient;
        this.initData();
        // resize
        this.resize();
        /**
         * start rendering
         */
        this.update();
    }

    initHtml(id) {
        if (!id || !/^[A-Za-z]+[\w\-]*$/.test(id)) throw new Error(`Invalid id specified= ${id}. Default rules, minus '.' and '-'.`);
        /**
         * create canvas element
         */
        let canvas = window.document.createElement('canvas');
        /**
         * set id
         */
        canvas.id = id;
        /**
         * append to body
         */
        this.canvas = document.body.appendChild(canvas);
    }

    initContext() {
        /**
         * get 2d context
         */
        this.ctx = this.canvas.getContext('2d');
        /**
         * initialize display trasform
         */
        this.displayTransform = new DisplayTransform(this.ctx);
        /**
         * setup moouse events
         */
        this.setupMouse();
    }

    transform(contentfulItem, parents) {
        return new Person(
            contentfulItem.sys.id,
            contentfulItem.fields.firstname + ' ' + contentfulItem.fields.lastname,
            parents ? (contentfulItem.fields.parents || []).map(p => this.transform(p, false)) : [],
            contentfulItem.fields.gender ? 'F' : 'M'
        );
    }

    initData() {
        var parentMaleOnLeft = true;

        this.dataClient.getEntries({
            content_type: 'person',
            select: 'fields.firstname,fields.lastname,fields.gender,fields.parents'
        }).then((response) => {
            let result = response.toPlainObject().items.map(item => {
                return this.transform(item, true);
            });

            var tData = transform(result, parentMaleOnLeft);

            let dan = tData.find(p => p.name.toLowerCase() == "dan handrea");

            this.root = new Node(this.ctx, new Point(0, 0), DEFAULT_SIZE, dan || tData[0], parentMaleOnLeft ? 'R' : 'L',
                true, 0, parentMaleOnLeft);

            var self = this;

            this.root.addListener('prezenta', (el) => {
                this.nodes.push(el);
                self.root.removeListener('prezenta');
            });
        });
    }

    resize() {
        /**
         * set to full window
         */
        this.canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
        this.canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
        /**
         * set displayTransform center to canvas center
         */
        this.displayTransform.ox = this.canvas.width / 2;
        this.displayTransform.oy = this.canvas.height / 2;
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

        this.mouse.addListener('drag', (e) => {
            // this.canvas.classList.add('drag');
        });

        this.mouse.addListener('dragend', () => {
            // this.canvas.classList.remove('drag');
        });

        this.mouse.addListener('click', this.mouseClick.bind(this));

        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
    }

    keyUp(e) {
        this.canvas.classList.remove('drag');
    }

    keyDown(e) {
        if (e.keyCode === 16) {
            this.canvas.classList.add('drag');
        }
    }



    update() {
        /**
         * FPS
         */
        this.fpsCounter.update();
        /**
         * update timer
         */
        this.timer += 1;
        /**
         * update the transform
         */
        this.displayTransform.update(this.mouse);
        /**
         * set home transform to clear the screen
         */
        this.displayTransform.setHome();
        /**
         * clear the screen
         */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        /**
         * set transform
         */
        this.displayTransform.setTransform();
        this.draw();
        /**
         * draw cursor
         * the cursor is hidden with css rules
         */
        this.drawCursor();
        /**
         * right click return to original position
         */
        if (this.mouse.buttonRaw === 4) {
            this.home();
        }
        /**
         * test mouse over
         */
        this.testMouseOver();
        /**
         * request next frame
         */
        requestAnimationFrame(this.update.bind(this));
    }

    home() {
        let
            dt = this.displayTransform,
            c = this.canvas;
        dt.x = 0;
        dt.y = 0;
        dt.scale = 1;
        dt.rotate = 0;
        dt.ox = c.width / 2;
        dt.oy = c.height / 2;
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.nodes.length, 200, 100);

        if (this.root) {
            this.root.update();
        }
    }

    drawCursor(averageFPS) {
        if (!this.mouse.over)
            return;

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

        ctx.fillText(`${this.fpsCounter.averageFPS}`, mouse.rx + 5, mouse.ry - 15);
        ctx.fillText(`x:${mouse.rx.toFixed(0)} y:${mouse.ry.toFixed(0)}`, mouse.rx + 5, mouse.ry - 5);

        ctx.stroke();
    }

    pointInCircle(point, circleCenterPoint, radius) {
        var distsq = Math.sqrt((point.x - circleCenterPoint.x) * (point.x - circleCenterPoint.x) + (point.y - circleCenterPoint.y) * (point.y - circleCenterPoint.y));
        return distsq <= radius;
    }

    testMouseOver() {
        let mouse = this.mouse;

        let mouseOver = false;

        if (this.nodes.length === 0) return;

        for (var i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i];
            let pic = this.pointInCircle(new Point(mouse.rx, mouse.ry), node.position, DEFAULT_SIZE);

            if (pic) {
                mouseOver = true;
                this.mouseOverNode = node;
            }

            node.mouseOver = pic;
        }

        if (!mouseOver)
            this.mouseOverNode = null;
    }

    mouseClick(e) {
        if (this.mouseOverNode && !e.shiftKey) {
            this.root = this.mouseOverNode;

            this.root.root = true;
            this.root.mouseOver = false;
            this.root.level = 0;
            this.root.stamp = 'R';
            this.root.reposition(CENTER);

            this.nodes = [this.root];
        }
    }
}