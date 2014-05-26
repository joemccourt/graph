GRA.updateModel = function(dt) {
	
	
	if(!GRA.rootKey) {
		var node = {children: [], p: {x:0.5,y:0}, v: Math.random(), level: 0};
		var nodeKey = ""+Math.random();
		GRA.graph[nodeKey] = node;
		GRA.rootKey = nodeKey;
		GRA.genRandomNodes(20);
		GRA.genRandomEdges(4.1);
	} else {


		if(GRA.dirtyCanvas) {
			GRA.setAllUnvisited();
			GRA.bfs(GRA.hoverNode, 0);
		}
		// GRA.insertBinTree(GRA.rootKey, nodeKey, 1);
		// GRA.insertHeap(GRA.rootKey, nodeKey, 0, 0);
	}

	
	GRA.dirtyCanvas = true;
};

GRA.setAllUnvisited = function() {

	for(var k in GRA.graph) {
		var node = GRA.graph[k];
		node.visited = false;
	}
}

GRA.dfs = function(nodeKey, level) {
	var node = GRA.graph[nodeKey];
	if(!node) {return;}

	if(!node.visited) {
		node.visited = true;
		node.level = level;
		
		for(var i = 0; i < node.children.length; i++) {
			GRA.dfs(node.children[i], level+1);
		}
	}
};

GRA.bfs = function(nodeKey) {
	if(!GRA.graph[nodeKey]) {return;}

	var searchQueue = [nodeKey];
	var levels = [0];
	var numSearched = 0;

	while(searchQueue.length - numSearched > 0) {
		var nodeSearchKey = searchQueue[numSearched];
		var level = levels[numSearched];
		var nodeSearch = GRA.graph[nodeSearchKey];
		numSearched++;

		if(!nodeSearch) {continue;}

		if(!nodeSearch.visited) {
			for(var i = 0; i < nodeSearch.children.length; i++) {
				searchQueue.push(nodeSearch.children[i]);
				levels.push(level+1);
			}
			nodeSearch.visited = true;
			nodeSearch.level = level;
		}


	}

}

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

GRA.swapNodes = function(nodeKeyTop, nodeKeyBottom) {
	var graph = GRA.graph;
	var nodeTop = graph[nodeKeyTop];
	var nodeBottom = graph[nodeKeyBottom];

	var tmpV = nodeBottom.v;
	nodeBottom.v = nodeTop.v;
	nodeTop.v = tmpV;

	// if(nodeTop.parent) {
	// 	var parent = graph[nodeTop.parent];
	// 	if(nodeTop.isLeft) {
	// 		parent.children[0] = nodeKeyBottom;
	// 	} else {
	// 		parent.children[1] = nodeKeyBottom;
	// 	}
	// }

	// var childrenBottomCopy = nodeBottom.children.slice(0);
	// var isLeftBottomCopy = nodeBottom.isLeft;
	// var bottomPCopy = {x:nodeBottom.p.x,y:nodeBottom.p.y};
	
	// if(nodeBottom.isLeft) {
	// 	nodeBottom.children[0] = nodeKeyTop;
	// 	nodeBottom.children[1] = nodeTop.children[1];

	// 	if(nodeTop.children[1]) {
	// 		graph[nodeTop.children[1]].parent = nodeKeyBottom;
	// 	}

	// } else {
	// 	nodeBottom.children[0] = nodeTop.children[0];
	// 	nodeBottom.children[1] = nodeKeyTop;

	// 	if(nodeTop.children[0]) {
	// 		graph[nodeTop.children[0]].parent = nodeKeyBottom;
	// 	}
	// }

	// nodeBottom.isLeft = nodeTop.isLeft;
	// nodeBottom.parent = nodeTop.parent;
	// nodeBottom.level--;
	// nodeTop.level++;

	// nodeTop.isLeft = isLeftBottomCopy;
	// nodeTop.children = childrenBottomCopy;
	// nodeTop.parent = nodeKeyBottom;

	// if(childrenBottomCopy[0]) {
	// 	graph[childrenBottomCopy[0]].parent = nodeKeyTop;
	// }

	// if(childrenBottomCopy[1]) {
	// 	graph[childrenBottomCopy[1]].parent = nodeKeyTop;
	// }

	// nodeBottom.p.x = nodeTop.p.x;
	// nodeBottom.p.y = nodeTop.p.y;

	// nodeTop.p.x = bottomPCopy.x;
	// nodeTop.p.y = bottomPCopy.y;
};

GRA.bubbleUp = function(nodeKey) {
	var node = GRA.graph[nodeKey];

	if(node.parent) {
		var parent = GRA.graph[node.parent];
		if(parent.v < node.v) {

			GRA.swapNodes(node.parent, nodeKey);
			GRA.bubbleUp(node.parent);
		}
	}
};

GRA.insertHeap = function(rootKey, nodeKey, level) {

	var root = GRA.graph[rootKey];
	var node = GRA.graph[nodeKey];
	// console.log(root.v.toString())

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

			GRA.bubbleUp(nodeKey);
			return;
		}

		if(!nodeSearch.children[1]) {
			node.p.x = nodeSearch.p.x + dx;
			node.p.y = 0.2*level;
			node.level = level;
			nodeSearch.children[1] = nodeKey;
			node.parent = nodeSearchKey;
			node.isLeft = false;

			GRA.bubbleUp(nodeKey);
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
		graph['somerandomKey'+i] = {children: [], v: (Math.random()+0.5), p: {x:Math.random(), y:Math.random()}};
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