GRA.gameBox = {x:0,y:0,w:1,h:1};

GRA.drawGame = function() {
	GRA.drawClear();
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

GRA.drawClear = function() {
	var ctx = GRA.ctx;
	ctx.save();

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;

	ctx.clearRect(0,0,w,h);
	ctx.restore();
};
