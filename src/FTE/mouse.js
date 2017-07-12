import EventEmitter from './eventEmitter.js';

export default class Mouse extends EventEmitter {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.alt = false;
        this.shift = false;
        this.ctrl = false;
        this.buttonLastRaw = 0; // user modified value
        this.buttonRaw = 0;
        this.over = false;
        this.buttons = [1, 2, 4, 6, 5, 3]; // masks for setting and clearing button raw bits;
    }
    move(event) {
        this.x = event.offsetX;
        this.y = event.offsetY;
        if (this.x === undefined) {
            this.x = event.clientX;
            this.y = event.clientY;
        }
        this.alt = event.altKey;
        this.shift = event.shiftKey;
        this.ctrl = event.ctrlKey;


        if (event.type === "mousemove" && this.buttonLastRaw === 1) {
            this.emit('drag', event);
        }

        if (event.type === "mousedown") {
            event.preventDefault()
            this.buttonRaw |= this.buttons[event.which - 1];
        } else if (event.type === "mouseup") {
            this.buttonRaw &= this.buttons[event.which + 2];
            this.emit('dragend', event);
            if (this.buttonLastRaw === 1) {
                this.emit('click', event);
            }
        } else if (event.type === "mouseout") {
            this.buttonRaw = 0;
            this.over = false;
        } else if (event.type === "mouseover") {
            this.over = true;
        } else if (event.type === "mousewheel") {
            event.preventDefault()
            this.w = event.wheelDelta;
        } else if (event.type === "DOMMouseScroll") { // FF you pedantic doffus
            this.w = -event.detail;
        }
        this.buttonLastRaw = this.buttonRaw;
    }
}