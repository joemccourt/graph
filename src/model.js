GRA.updateModel = function(dt) {

	var altitude = Math.sqrt(3)/2;
	for(var i = 0; i < GRA.boids.length; i++) {
		var boid = GRA.boids[i];
		var boid1 = GRA.boids[boid.b1];
		var boid2 = GRA.boids[boid.b2];

		var x = boid.x;
		var y = boid.y;
		var x1 = boid1.x;
		var y1 = boid1.y;
		var x2 = boid2.x;
		var y2 = boid2.y;

		var midX = (x1+x2)/2;
		var midY = (y1+y2)/2;

		var dx = x2 - x1;
		var dy = y2 - y1;

		var factor = 1;
		var length2 = dx*dx+dy*dy;

		if(length2 < 0.2*0.2) {
			factor = 0.2*0.2/length2;
		} else if (length2 > 0.8*0.8) {
			factor = 0.8*0.8/length2;
		}

		var goalX1 = midX + factor * altitude * dy;
		var goalY1 = midY - factor * altitude * dx;

		var goalX2 = midX - factor * altitude * dy;
		var goalY2 = midY + factor * altitude * dx;

		var goalX = goalX2;
		var goalY = goalY2;
		if((goalX1-x)*(goalX1-x) + (goalY1-y)*(goalY1-y) < (goalX2-x)*(goalX2-x) + (goalY2-y)*(goalY2-y)) {
			

			goalX = goalX1;
			goalY = goalY1;
		} else {


		}
	
		var dx = (goalX - x) * 0.0005;
		var dy = (goalY - y) * 0.0005;

		var maxV = 0.0001;
		if(dx*dx + dy*dy > maxV*maxV) {
			var v = Math.sqrt(dx*dx + dy*dy);
			dx *= maxV / v;
			dy *= maxV / v;
		}

		boid.x = x + dt * dx;
		boid.y = y + dt * dy;


		boid.x += dt * (-boid.x) * 0.00005;
		boid.y += dt * (-boid.y) * 0.00005;
	}
};

GRA.initNewGameState = function() {
	GRA.initModel();

	var boids = [];
	var x = -1;
	var y = -1;
	var w = 2;//world.size.w;
	var h = 2;//world.size.h;

	var scale = 0.3;
	GRA.gameBox.x = scale*x;
	GRA.gameBox.y = scale*y;
	GRA.gameBox.w = scale*w;
	GRA.gameBox.h = scale*h;

	var colorSet = GRA.colorSets['xanthe'];
	var n = 1000;
	for(var i = 0; i < n; i++) {
		var boid = {"x": x + Math.random() * w, "y": y + Math.random() * h};

		var b1 = i;
		var b2 = i;
		while(b1 == i) {
			b1 = Math.random() * n | 0;
		}

		while(b2 == i || b2 == b1) {
			b2 = Math.random() * n | 0;
		}

		boid.b1 = b1;
		boid.b2 = b2;

		boid.color = GRA.colorToStr(colorSet[(colorSet.length*Math.random())|0],0.15);

		boids[i] = boid;
	}

	GRA.boids = boids;
};

GRA.initModel = function() {

};