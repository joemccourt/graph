GRA.updateModel = function(dt) {
	GRA.searchNodes();
	GRA.dirtyCanvas = true;
};

GRA.getNodeKeyArray = function() {
	var keys = [];
	for(var k in GRA.graph) {
		keys.push(k);
	}
	return keys;
};

GRA.getNextUnvisted = function() {
	for(var k in GRA.graph) {
		var node = GRA.graph[k];
		if(!node.visited) {
			return k;
		}
	}
	return false;
};

GRA.unsetNodeLevels = function() {
	for(var k in GRA.graph) {
		var node = GRA.graph[k];
		node.level = undefined;
	}
};

GRA.rankNodes = function(pivot) {
	
	function partition(nodes, left, right, pivot) {
		while(left < right) {

			while(left < right && nodes[left].v < pivot) {
				left++;
			}

			while(left < right && nodes[right].v >= pivot) {
				right--;
			}

			var tmpNode = nodes[left];
			nodes[left] = nodes[right];
			nodes[right] = tmpNode;
		}

		return left;
	}

	var nodes = [];
	for(var k in GRA.graph) {
		nodes.push(GRA.graph[k]);
		// console.log("1",GRA.graph[k].v);
	}

	var left = 0;
	var right = nodes.length-1;
	var newLeft = partition(nodes, left, right, pivot);

	// console.log(left, newLeft);
	var jitter = 0;//0.5 * 0.03;
	for(var i = 0; i < nodes.length; i++) {
		// console.log("2",nodes[i].v);
		if(i < newLeft) {
			nodes[i].p.x = 0.25 + jitter * (Math.random()-0.5)*2;
		} else {
			nodes[i].p.x = 0.75 + jitter * (Math.random()-0.5)*2;
		}
	}

};

GRA.initializeGraph = function() {
	GRA.graphInitialized = true;

	GRA.genRandomNodes(40);
};

GRA.searchNodes = function() {
	if(!GRA.graphInitialized) {
		GRA.initializeGraph();
		// var node = {children: [], p: {x:0.5,y:0}, v: Math.random(), level: 0};
		// var nodeKey = ""+Math.random();
		// GRA.graph[nodeKey] = node;
		// GRA.rootKey = nodeKey;
		// GRA.genRandomNodes(500);
		// GRA.genRandomEdges(1);
	} else {

		// if(GRA.dirtyCanvas) {
		// 	GRA.setAllUnvisited();
		// 	GRA.bfs(GRA.hoverNode, 0);
		// }

		// GRA.insertBinTree(GRA.rootKey, nodeKey, 1);
		// GRA.insertHeap(GRA.rootKey, nodeKey, 0, 0);
	}
};

GRA.getLevelInfo = function() {
	var levels = [];
	for(var k in GRA.graph) {
		var node = GRA.graph[k];

		if(node.level) {
			if(!levels[node.level]) {
				levels[node.level] = 0;
			}

			levels[node.level]++;
		}
	}

	return levels;
};

GRA.organizeByLevel = function() {
	var offset = 0;
	var node = GRA.hoverNode;
	GRA.setAllUnvisited();
	while(node) {
		GRA.unsetNodeLevels();
		GRA.bfs(node, 0);
		GRA.organizeByLevelSection(offset);
		node = GRA.getNextUnvisted();
		
		offset += (GRA.getLevelInfo().length+1) * 0.1;
	}
};

GRA.organizeByLevelSection = function(offset) {
	var levelInfo = GRA.getLevelInfo();
	var levelCounts = [];

	var nodesByLevel = {};

	for(var i = 0; i < levelInfo.length; i++) {
		levelCounts[i] = 0;
	}

	var dy = 0.1;//1/Math.max(2,levelInfo.length);
	var jitter = dy*0.05;

	for(var k in GRA.graph) {
		var node = GRA.graph[k];

		var x = 0.5;
		var y = node.level * dy + Math.random() * jitter + offset;

		if(typeof node.level === "number") {
			if(!nodesByLevel[node.level]) {
				nodesByLevel[node.level] = [];
			}

			nodesByLevel[node.level].push(node);

			var levelCount = levelCounts[node.level];
			var numInLevel = levelInfo[node.level];
			if(numInLevel > 1) {
				x = (levelCount + (numInLevel%2==1?0:0)) / (numInLevel-1);
			}

			levelCounts[node.level]++;
		} else {
			x = node.p.x;//Math.random();
			y = node.p.y;//Math.random();
		}

		node.p.x = x;
		node.p.y = y;

	}

	//Rearange...
	//Heuristic to better organize
	for(var k in nodesByLevel) {
		var nodes = nodesByLevel[k];
		var expectations = [];

		// console.log(k);
		if(k == 0 || nodes.length <= 1) {continue;}
		
		for(var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var count = 0;
			var xExpectation = 0;

			for(var j = 0; j < node.children.length; j++) {
				var childNode = GRA.graph[node.children[j]];
				if(childNode.level == node.level-1) {
					// if(nodesByLevel[childNode.level]) {
						xExpectation += nodesByLevel[childNode.level].indexOf(childNode);
						count++;
						// console.log("parent", nodesByLevel[childNode.level].indexOf(childNode));
					// }
				}
			}

			xExpectation = xExpectation/count;

			// console.log(node.v, k, i, xExpectation);	
			expectations.push({index:i,value:xExpectation,node:node});
		}

		expectations.sort(function(a,b){ if(a.value < b.value) { return -1;} else { return 1;}});

		// console.log(expectations);
		for(var i = 0; i < nodes.length; i++) {
			var node = expectations[i].node;
			node.p.x = (i + (nodes.length%2==1?0:0)) / (nodes.length-1);
		}

		//reset nodesByLevel order
		for(var i = 0; i < nodes.length; i++) {
			nodesByLevel[k][i] = expectations[i].node;
		}
	}
	// console.log(nodesByLevel)
};

GRA.setAllUnvisited = function() {
	for(var k in GRA.graph) {
		var node = GRA.graph[k];
		node.visited = false;
		node.level = undefined;
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

	var bidirectional = true;
	if(bidirectional) {density /= 2;}

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

		if(bidirectional) {
			graph[keyArray[randKeyIndex2]].children.push(keyArray[randKeyIndex1]);
		}
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