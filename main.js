window.addEventListener('load', function () {
	console.log('window - load - bubble'); // 4th
	init();
});

function init() {
	var ctx = canvas.getContext('2d'),
		transX = canvas.width * 0.5,
		transY = canvas.height * 0.5;

	ctx.translate(transX, transY);

	ctx.fillRect(0, -transY, 1, canvas.height);
	ctx.fillRect(-transX, 0, canvas.width, 1);

	var drawPoint = function (e) {
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		var pos = getMousePos(canvas, e);
		ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
		ctx.fill();
	}

	canvas.onmousemove = function (e) {
		var pos = getMousePos(canvas, e);
		out.innerHTML = 'X:' + pos.x + ' Y:' + pos.y;
		out2.innerHTML = 'X:' + e.clientX + 'Y:' + e.clientY;
	}

	canvas.onclick = function (e) {
		drawPoint(e);
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left - transX,
			y: evt.clientY - rect.top - transY
		};
	}
}