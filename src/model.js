GRA.updateModel = function(dt) {
	
	var node = {children: [], p: {x:0.5,y:0}, v: Math.random(), level: 0};

	var nodeKey = ""+Math.random();
	GRA.graph[nodeKey] = node;

	if(!GRA.rootKey) {
		GRA.rootKey = nodeKey;
		GRA.numNodes = 1;
	} else {

		// GRA.insertBinTree(GRA.rootKey, nodeKey, 1);
		GRA.numNodes++;
		GRA.insertHeap(GRA.rootKey, nodeKey, 0, 0);
	}

	
	GRA.dirtyCanvas = true;
};

GRA.insertBinTree = function(rootKey, nodeKey, level) {

	var root = GRA.graph[rootKey];
	var node = GRA.graph[nodeKey];

	if(!root) {
		return nodeKey;
	}

	var dx = 1/Math.pow(2,level);

	if(node.v < root.v) {
		if(!root.children[0]) {
			root.children[0] = nodeKey;
			node.p.x = root.p.x - dx;
			node.p.y = 0.2*level;
		} else {
			GRA.insertBinTree(root.children[0], nodeKey, level+1);
		}
	} else {
		if(!root.children[1]) {
			root.children[1] = nodeKey;
			node.p.x = root.p.x + dx;
			node.p.y = 0.2*level;
		} else {
			GRA.insertBinTree(root.children[1], nodeKey, level+1);
		}
	}

};

GRA.insertHeap = function(rootKey, nodeKey, level) {

	var root = GRA.graph[rootKey];
	var node = GRA.graph[nodeKey];

	var searchQueue = [rootKey];
	var numSearched = 0;

	while(searchQueue.length - numSearched > 0) {
		var nodeSearchKey = searchQueue[numSearched];
		var nodeSearch = GRA.graph[nodeSearchKey];
		numSearched++;

		var level = nodeSearch.level+1;
		var dx = 1/Math.pow(2,level);

		if(!nodeSearch.children[0]) {
			node.p.x = nodeSearch.p.x - dx;
			node.p.y = 0.2*level;
			node.level = level;
			nodeSearch.children[0] = nodeKey;
			node.parent = nodeSearchKey;
			node.isLeft = true;

			return;
		}

		if(!nodeSearch.children[1]) {
			node.p.x = nodeSearch.p.x + dx;
			node.p.y = 0.2*level;
			node.level = level;
			nodeSearch.children[1] = nodeKey;
			node.parent = nodeSearchKey;
			node.isLeft = false;

			return;
		}

		searchQueue.push(nodeSearch.children[0]);
		searchQueue.push(nodeSearch.children[1]);
	}

	// var n = 
	// var n = GRA.numNodes;


};


GRA.genBinaryTreeHelper = function(node, level, maxLeveL) {
	if(level > maxLeveL) {return;}
	if(!node) {return;}

	var dx = 1/Math.pow(2,level);
	var nodeL = {children: [], p: {x:node.p.x - dx, y:0.1*level}};
	var nodeR = {children: [], p: {x:node.p.x + dx, y:0.1*level}};

	var lKey = "L"+level+Math.random();
	var rKey = "R"+level+Math.random();
	GRA.graph[lKey] = nodeL;
	GRA.graph[rKey] = nodeR;

	node.children = [lKey,rKey];
	GRA.genBinaryTreeHelper(nodeL, level+1, maxLeveL);
	GRA.genBinaryTreeHelper(nodeR, level+1, maxLeveL);

};

GRA.genBinaryTree = function(levels) {
	var graph = GRA.graph;

	var dy = 0.1
	var root =  {children: [], p: {x:0.5,y:0}};
	graph['root'] = root;

	GRA.genBinaryTreeHelper(root, 1, levels);

	GRA.graph = graph;
};

GRA.genRandomNodes = function(n) {
	var graph = GRA.graph;

	for(var i = 0; i < n; i++) {
		graph['somerandomKey'+i] = {children: [], p: {x:Math.random(), y:Math.random()}};
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

	// GRA.genBinaryTree(6);
	// GRA.genRandomNodes(300);
	// GRA.genRandomEdges(1.0);
};

GRA.initModel = function() {

};