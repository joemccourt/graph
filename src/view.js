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

	ctx.lineWidth = 3;

	var w = GRA.canvas.width;
	var h = GRA.canvas.height;
	var b = GRA.gameBox;

	ctx.font = 0.02*(w+h)/2 + "px Lucida Console";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	var selectedChildren = [];
	var hoverChildren = [];
	if(GRA.graph[GRA.selectedNode]) {
		selectedChildren = GRA.graph[GRA.selectedNode].children;
	}
	if(GRA.graph[GRA.hoverNode]) {
		hoverChildren = GRA.graph[GRA.hoverNode].children;
	}

	//Edges
	for(var key in GRA.graph) {
		var node = GRA.graph[key];

		var x = ((node.p.x - b.x) / b.w) * w;
		var y = ((node.p.y - b.y) / b.h) * h;

		var c = node.children;

		if(c.length > 0) {
			ctx.beginPath();
		
			if(key === GRA.selectedNode) {
				ctx.strokeStyle = 'rgba(200,100,0,0.5)';
			} else if(key === GRA.hoverNode) {
				ctx.strokeStyle = 'rgba(0,200,200,0.5)';
			} else if(selectedChildren.indexOf(key) >= 0) {
				ctx.strokeStyle = 'rgba(100,50,0,0.5)';
			} else if(hoverChildren.indexOf(key) >= 0) {
				ctx.strokeStyle = 'rgba(0,100,100,0.5)';
			} else {
				ctx.strokeStyle = 'rgba(0,0,0,0.5)';
			}

			for(var k = 0; k < c.length; k++) {

				var childNode = GRA.graph[c[k]];

				if(childNode) {
					var xC = ((childNode.p.x - b.x) / b.w) * w;
					var yC = ((childNode.p.y - b.y) / b.h) * h;

					ctx.moveTo(x,y);
					ctx.lineTo(xC,yC);
				}
			}

			ctx.stroke();
			ctx.fill();
		}
	}


	for(var key in GRA.graph) {
		var node = GRA.graph[key];

		if(key === GRA.selectedNode) {
			ctx.fillStyle = 'rgba(255,0,0,0.8)';
		} else if(key === GRA.hoverNode) {
			ctx.fillStyle = 'rgba(0,0,255,0.8)';
		} else if(selectedChildren.indexOf(key) >= 0) {
			ctx.fillStyle = 'rgba(100,0,0,0.8)';
		} else if(hoverChildren.indexOf(key) >= 0) {
			ctx.fillStyle = 'rgba(0,0,100,0.8)';
		} else {
			ctx.fillStyle = 'rgba(127,127,127,0.5)';
		}

		var x = ((node.p.x - b.x) / b.w) * w;
		var y = ((node.p.y - b.y) / b.h) * h;


		ctx.beginPath();
		
		ctx.beginPath();
		ctx.arc(x,y,25*node.v, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.fill();

		if(node.visited) {
			ctx.fillStyle = 'black';
			ctx.fillText(node.level,x,y);
		}
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
