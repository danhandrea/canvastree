import Ui2d from './ui2d.js';

export default class Circle extends Ui2d {
	constructor(ctx, position, radius) {
		super(ctx, position);
		this.radius = radius;
		this.mouseOver = false;
	}

	update() {
		if (this.mouseOver) {
			this.drawGreenCircle();
		} else {
			this.drawCircle();
		}
	}

	drawCircle() {
		let ctx = this.ctx;

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.person.gender === 'F' ? 'pink' : 'lightblue';
		ctx.fill();
	}
	
	drawGreenCircle() {
		let ctx = this.ctx;

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'lightgreen';
		ctx.fill();
	}
}