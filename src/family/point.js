export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static get origin() {
		return new Point(0, 0);
	}
}