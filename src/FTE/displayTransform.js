export default class DisplayTransform {
    constructor(ctx) {
        this.x = 0;
        this.y = 0;
        this.ox = 0;
        this.oy = 0;
        this.scale = 1;
        this.rotate = 0;
        this.cx = 0; // chase values Hold the actual display
        this.cy = 0;
        this.cox = 0;
        this.coy = 0;
        this.cscale = 1;
        this.crotate = 0;
        this.dx = 0; // deltat values
        this.dy = 0;
        this.dox = 0;
        this.doy = 0;
        this.dscale = 1;
        this.drotate = 0;
        this.drag = 0.1; // drag for movements
        this.accel = 0.9; // acceleration
        this.matrix = [0, 0, 0, 0, 0, 0]; // main matrix
        this.invMatrix = [0, 0, 0, 0, 0, 0]; // invers matrix;
        this.mouseX = 0;
        this.mouseY = 0;
        this.ctx = ctx;
    }

    setTransform() {
        var m = this.matrix;
        var i = 0;
        this.ctx.setTransform(m[i++], m[i++], m[i++], m[i++], m[i++], m[i++]);
    }
    setHome() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    convert(x, y) {

    }
    update(mouse) {
        // smooth all movement out. drag and accel control how this moves
        // acceleration 
        this.dx += (this.x - this.cx) * this.accel;
        this.dy += (this.y - this.cy) * this.accel;
        this.dox += (this.ox - this.cox) * this.accel;
        this.doy += (this.oy - this.coy) * this.accel;
        this.dscale += (this.scale - this.cscale) * this.accel;
        this.drotate += (this.rotate - this.crotate) * this.accel;
        // drag
        this.dx *= this.drag;
        this.dy *= this.drag;
        this.dox *= this.drag;
        this.doy *= this.drag;
        this.dscale *= this.drag;
        this.drotate *= this.drag;
        // set the chase values. Chase chases the requiered values
        this.cx += this.dx;
        this.cy += this.dy;
        this.cox += this.dox;
        this.coy += this.doy;
        this.cscale += this.dscale;
        this.crotate += this.drotate;

        // create the display matrix
        this.matrix[0] = Math.cos(this.crotate) * this.cscale;
        this.matrix[1] = Math.sin(this.crotate) * this.cscale;
        this.matrix[2] = -this.matrix[1];
        this.matrix[3] = this.matrix[0];

        // set the coords relative to the origin
        this.matrix[4] = -(this.cx * this.matrix[0] + this.cy * this.matrix[2]) + this.cox;
        this.matrix[5] = -(this.cx * this.matrix[1] + this.cy * this.matrix[3]) + this.coy;


        // create invers matrix
        var det = (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);
        this.invMatrix[0] = this.matrix[3] / det;
        this.invMatrix[1] = -this.matrix[1] / det;
        this.invMatrix[2] = -this.matrix[2] / det;
        this.invMatrix[3] = this.matrix[0] / det;

        // check for mouse. Do controls and get real position of mouse.
        if (mouse !== undefined) { // if there is a mouse get the real cavas coordinates of the mouse
            if (mouse.oldX !== undefined && (mouse.buttonRaw & 1) === 1) { // check if panning (middle button)
                var mdx = mouse.x - mouse.oldX; // get the mouse movement
                var mdy = mouse.y - mouse.oldY;
                // get the movement in real space
                var mrx = (mdx * this.invMatrix[0] + mdy * this.invMatrix[2]);
                var mry = (mdx * this.invMatrix[1] + mdy * this.invMatrix[3]);
                this.x -= mrx;
                this.y -= mry;
            }
            // do the zoom with mouse wheel
            if (mouse.w !== undefined && mouse.w !== 0) {
                this.ox = mouse.x;
                this.oy = mouse.y;
                this.x = this.mouseX;
                this.y = this.mouseY;
                /* Special note from answer */
                // comment out the following is you change drag and accel
                // and the zoom does not feel right (lagging and not 
                // zooming around the mouse 

                this.cox = mouse.x;
                this.coy = mouse.y;
                this.cx = this.mouseX;
                this.cy = this.mouseY;

                if (mouse.w > 0) { // zoom in
                    this.scale *= 1.1;
                    mouse.w -= 20;
                    if (mouse.w < 0) {
                        mouse.w = 0;
                    }
                }
                if (mouse.w < 0) { // zoom out
                    this.scale *= 1 / 1.1;
                    mouse.w += 20;
                    if (mouse.w > 0) {
                        mouse.w = 0;
                    }
                }

            }
            // get the real mouse position 
            var screenX = (mouse.x - this.cox);
            var screenY = (mouse.y - this.coy);
            this.mouseX = this.cx + (screenX * this.invMatrix[0] + screenY * this.invMatrix[2]);
            this.mouseY = this.cy + (screenX * this.invMatrix[1] + screenY * this.invMatrix[3]);
            mouse.rx = this.mouseX; // add the coordinates to the mouse. r is for real
            mouse.ry = this.mouseY;
            // save old mouse position
            mouse.oldX = mouse.x;
            mouse.oldY = mouse.y;
        }

    }
}