import Point from './point.js';
import EventEmitter from '../FTE/eventEmitter.js';

export default class Ui2d extends EventEmitter {
	constructor(ctx, position) {
		super();
		this.ctx = ctx;
		this.position = position || Point.origin;
	}
}