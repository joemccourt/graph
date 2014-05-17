GRA.gameBox = {x:0,y:0,w:1,h:1};

GRA.drawGame = function() {
	GRA.drawClear();
	GRA.viewGraph();
};

GRA.getSubBox = function(parentBox,childBox) {
	var subBox = {x:0,y:0,w:0,h:0};

	subBox.x = parentBox.x + childBox.x * parentBox.w;
	subBox.y = parentBox.y + childBox.y * parentBox.h;
	subBox.w = childBox.w * parentBox.w;
	subBox.h = childBox.h * parentBox.h;

	return subBox;
};

GRA.pointInBox = function(x, y, box) {
	return x > box.x && x < box.x+box.w && y > box.y && y < box.y+box.h;
};

GRA.viewGraph = function() {

	var ctx = GRA.ctx;
	ctx.save();

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;
	var b = GRA.gameBox;

	ctx.fillStyle = 'gray';
	for(var key in GRA.graph) {
		var node = GRA.graph[key];

		var x = ((node.p.x - b.x) / b.w) * w;
		var y = ((node.p.y - b.y) / b.h) * h;

		ctx.beginPath();
		
		ctx.beginPath();
		ctx.arc(x,y,15, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.fill();
	}

	ctx.restore();
};

GRA.drawClear = function() {
	var ctx = GRA.ctx;
	ctx.save();

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;

	ctx.clearRect(0,0,w,h);
	ctx.restore();
};
