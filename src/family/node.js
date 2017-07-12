import Circle from './circle.js';
import Point from './point.js';

export default class Node extends Circle {
	constructor(ctx, position, size, person, stamp, root, level, parentMaleOnLeft, parentNode) {
		super(ctx, position, size);

		this.person = person;
		/**
		 * for parents
		 */
		this.stamp = stamp;
		this.root = root;
		this.level = level;
		this.parentMaleOnLeft = parentMaleOnLeft;
		if (level >= 0) {
			this.parentPositions = this.getParentPositions();
			this.setParents();
		}
		/**
		 * for mouse over
		 */
		this.facutPrezenta = false;
		/**
		 * for children
		 */
		this.childNodes = [];
		this.parentNode = parentNode;
		this.childrenPositions = level <= 0 ? this.getChildrenPositions() : [];
		if (level <= 0)
			this.setChildNodes();

	}

	reposition(newPosition) {
		this.position = newPosition;
		this.facutPrezenta = false;

		if (this.level >= 0) {
			this.parentPositions = this.getParentPositions();
			this.setParents();

			if (this.leftParentNode) {
				this.leftParentNode.root = false;
				this.leftParentNode.level = this.level + 1;
				this.leftParentNode.reposition(this.parentPositions.left);
			}
			if (this.rightParentNode) {
				this.rightParentNode.root = false;
				this.rightParentNode.level = this.level + 1;
				this.rightParentNode.reposition(this.parentPositions.right);
			}
		}

		this.childrenPositions = this.level <= 0 ? this.getChildrenPositions() : [];
		this.setChildNodes();

		this.childNodes.forEach((c, i) => {
			c.position = this.childrenPositions[i];
			c.level = this.level - 1;
		});
	}

	setParents() {
		var self = this;

		this.rightParent = this.person.parents.find(p => p.onRight === true);
		this.leftParent = this.person.parents.find(p => p.onRight === false);

		if (this.leftParent) {
			this.leftParentNode = new Node(
				this.ctx,
				this.parentPositions.left,
				this.size,
				this.leftParent,
				this.root ? 'R' : this.stamp + 'R',
				false,
				this.level + 1);

			if (this.leftParentNode) {
				this.leftParentNode.addListener('prezenta', (node) => {
					self.emit('prezenta', node);
				});
			}
		}

		if (this.rightParent) {
			this.rightParentNode = new Node(
				this.ctx,
				this.parentPositions.right,
				this.size,
				this.rightParent,
				this.root ? 'L' : this.stamp + 'L',
				false,
				this.level + 1);

			if (this.rightParentNode) {
				this.rightParentNode.addListener('prezenta', (node) => {
					self.emit('prezenta', node);
				});
			}
		}
	}

	setChildNodes() {
		let self = this;
		this.childNodes = [];

		for (var i = 0; i < this.person.children.length; i++) {
			var c = this.person.children[i];
			let childNode = new Node(
				this.ctx,
				this.childrenPositions[i],
				this.size,
				c,
				'',
				false,
				this.level - 1,
				this.parentMaleOnLeft,
				this);

			childNode.addListener('prezenta', (node) => {
				self.emit('prezenta', node);
			});

			this.childNodes.push(childNode);
		}
	}

	get size() {
		return this.radius;
	}

	set size(value) {
		this.radius = value;
	}

	getParentPositions() {
		let index = this.indexOf(this.stamp);

		const amount = (moveLeft, char) => {
			if (char === 'R')
				if (moveLeft)
					return this.position.x - index * (this.size * 2);
				else
					return (this.position.x + (index - 1) * this.size * 2);

			if (char === 'L') {
				if (moveLeft)
					return (this.position.x - (index - 1) * this.size * 2);
				else
					return this.position.x + index * (this.size * 2);
			}
			return 0;
		}

		var moveLeft = this.root ? false : this.stamp[0] === 'L' ? false : true;

		let lParentX = (this.root ? this.position.x - this.size : amount(moveLeft, 'R'));
		let lParentY = this.position.y - (this.size * 2);

		let rParentX = (this.root ? this.position.x + this.size : amount(moveLeft, 'L'));
		let rParentY = lParentY;

		return {
			right: new Point(rParentX, rParentY),
			left: new Point(lParentX, lParentY)
		}
	}

	getChildrenPositions() {
		let children = this.person.children;
		let even = children.length % 2 === 0;

		// y should be the same for all situations
		let y = this.position.y + this.size * 2;

		// let's just put them in order
		const getX = (i) => {
			let x = this.position.x + this.size * 2 * i;

			if (this.root || this.position.x === 0) {
				x -= (children.length * 2 * this.size) / 2 - (this.size) /*half circle*/ ;
			}

			return x;
		}

		return children.map((c, i) => new Point(getX(i), y));
	}

	indexOf(stamp) {
		if (!stamp)
			return -1;

		const max = Math.pow(2, stamp.length - 1);

		var index = 1;

		const first = stamp[0];

		for (let i = 1; i < stamp.length; i++) {
			if (stamp[i] == first) {
				index += index;
			} else if (i > 1) {
				let tmpStamp = stamp.substring(0, stamp.length - 1);
				let nextr = this.next(tmpStamp);
				var indexOfNext = this.indexOf(nextr)
				if (tmpStamp[0] !== nextr[0])
					index = indexOfNext;
				else
					index += indexOfNext;
			}
		}

		return index;
	}

	next(stamp) {
		if (!stamp || !stamp.length || stamp.length === 0) return stamp;
		let nextStamp = '';
		/**
		 * reverse back flip :)
		 * One rule :
		 * 	If we changed an R we no longer make changes
		 */
		let changedRight = false;

		for (let li = stamp.length - 1, fi = 0, ci = li; ci >= fi; ci--) {
			let c = stamp[ci];
			if (ci === li) {
				changedRight = c === 'R';
				nextStamp = this.reversePosition(c);
			} else {
				if (changedRight) {
					nextStamp += c;
				} else {
					changedRight = c === 'R';
					nextStamp += this.reversePosition(c);
				}
			}
		}

		return nextStamp.split('').reverse().join('');
	}

	reversePosition(c) {
		if (!c || !c.length || !c.length === 1) return c;

		return c === 'L' ? 'R' : 'L';
	}


	update() {
		super.update();
		var context = this.ctx;
		let self = this;

		this.emitOnce('prezenta', this);

		context.fillStyle = 'black';
		context.textAlign = 'center';
		context.fillText(this.person.name, this.position.x, this.position.y);
		// context.fillText(` ${this.position.x} ${this.position.y}`, this.position.x - this.size / 2, this.position.y - this.size / 2 + 10);
		// context.fillText(` ${this.level}`, this.position.x - this.size / 2, this.position.y - this.size / 2 + 20);
		// context.fillText(` ${this.stamp}`, this.position.x - this.size / 2, this.position.y - this.size / 2 + 20);
		// console.log(this);
		// console.log(this.stamp);

		if (this.level >= 0) {
			if (this.leftParentNode) {
				this.leftParentNode.update();
				this.drawLine(this.position, this.parentPositions.left);
			}
			if (this.rightParentNode) {
				this.rightParentNode.update();
				this.drawLine(this.position, this.parentPositions.right);
			}
		}
		if (this.level <= 0 && this.childNodes) {
			this.childNodes.forEach(n => {
				n.update();
				self.drawLine(self.position, n.position);
			});

		}
	}

	drawLine(source, target) {
		let ctx = this.ctx;

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(source.x, source.y);
		ctx.lineTo(target.x, target.y);
		ctx.stroke();
	}
}