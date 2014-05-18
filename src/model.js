GRA.updateModel = function(dt) {
	
};

GRA.genRandomNodes = function(n) {
	var graph = GRA.graph;

	for(var i = 0; i < n; i++) {
		graph['somerandomKey'+i] = {children: [], p: {x:Math.random(), y:Math.random()}}
	}

	GRA.graph = graph;
};

GRA.genRandomEdges = function(density) {
	var graph = GRA.graph;

	var keyArray = [];
	for(var key in graph) {
		keyArray.push(key);
	}

	var numNodes = keyArray.length;
	var numEdges = Math.round(density * numNodes);

	numEdges = Math.min(numNodes * (numNodes - 1) / 2, numEdges);

	for(var k = 0; k < numEdges; k++) {

		var randKeyIndex1 = Math.random() * numNodes | 0;
		var randKeyIndex2 = randKeyIndex1;

		while(randKeyIndex1 == randKeyIndex2) {
			randKeyIndex2 = Math.random() * numNodes | 0;
		}

		graph[keyArray[randKeyIndex1]].children.push(keyArray[randKeyIndex2]);
	}
};

GRA.initNewGameState = function() {
	GRA.graph = {};
	GRA.genRandomNodes(300);
	GRA.genRandomEdges(1.0);
};

GRA.initModel = function() {

};