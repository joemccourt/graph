GRA.updateModel = function(dt) {
	
};

GRA.initNewGameState = function() {

	var graph = {};

	var n = 1000;
	for(var i = 0; i < n; i++) {
		graph['somerandomKey'+i] = {children: [], p: {x:Math.random(), y:Math.random()}}
	}

	GRA.graph = graph;

};

GRA.initModel = function() {

};