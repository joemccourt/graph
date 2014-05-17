GRA.selectBox = {x:0.05,y:0.05,w:0.15,h:0.3};
GRA.infoBox = {x:0.7,y:0.05,w:0.28,h:0.5};
GRA.gameBox = {x:0,y:0,w:1,h:1};
GRA.saveBox = {x:0.05,y:0.30,w:0.9,h:0.65};

GRA.drawGame = function() {
	GRA.drawClear();	
	GRA.drawBoids();
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

GRA.drawBoids = function(parentBox, worldID) {
	var ctx = GRA.ctx;
	ctx.save();

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;
	var b = GRA.gameBox;

	for(var i = 0; i < GRA.boids.length; i++) {
		var boid = GRA.boids[i];
		var boid1 = GRA.boids[boid.b1];
		var boid2 = GRA.boids[boid.b2];
		var x = ((boid.x - b.x) / b.w) * w;
		var y = ((boid.y - b.y) / b.h) * h;

		var x1 = ((boid1.x - b.x) / b.w) * w;
		var y1 = ((boid1.y - b.y) / b.h) * h;

		var x2 = ((boid2.x - b.x) / b.w) * w;
		var y2 = ((boid2.y - b.y) / b.h) * h;

		ctx.fillStyle = boid.color;
		ctx.strokeStyle = boid.color;

		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x,y);
		ctx.lineTo(x2,y2);
		ctx.closePath();
		ctx.fill();

	}

	// for(var i = 0; i < GRA.boids.length; i++) {
	// 	var boid = GRA.boids[i];
	
	// 	var x = ((boid.x - b.x) / b.w) * w;
	// 	var y = ((boid.y - b.y) / b.h) * h;
		
	// 	ctx.fillStyle = boid.color;

	// 	ctx.beginPath();
	// 	ctx.arc(x,y,3, 0, 2 * Math.PI, false);
	// 	ctx.closePath();
	// }
	// 	ctx.fill();	

	ctx.restore();
};

GRA.drawClear = function() {
	var ctx = GRA.ctx;
	ctx.save();

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;

	// ctx.fillStyle = 'black'
	ctx.clearRect(0,0,w,h);
	// ctx.fill();
	ctx.restore();
};
