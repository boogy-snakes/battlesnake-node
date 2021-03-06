
// converts input into interesting stuff
var config = require('../config.json');
var distance = require('./core.js').distance;
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;
var UnionFind = require('unionfind');

function preprocessor(){

	function predict(data) {

		var longestSnake = data.you;

		var snakeData = {};
		for(var snake of data.snakes) {
			snakeData[snake.id] = snake;
		}
		console.log(snakeData);

		data.current = toXY(snakeData[data.you].coords[0]);
		data.pmap = renderSnakes(snakeData, {x:data.width, y:data.height}, 1);
		data.walls = data.walls || [];
		data.pmap = renderWalls(data.pmap, data.walls, 1);

		data.graph = findGraph(data.pmap, data.snakes, 1);
		data.dfs = dfs(data.graph);

		for(var id in snakeData) {

			snakeData[id].map = shortenAs(data.pmap, snakeData, id, 0);
			snakeData[id].map = headsAs(snakeData[id].map, snakeData, id, 0.4);

			if(snakeData[id].coords.length > snakeData[longestSnake].coords.length){
				longestSnake = id;
			}
		}

		data.snakes = snakeData;
		data.longest = longestSnake;

		return data;
	}


	// creates a map of 1s and 0s where there are blocks
	function renderSnakes(snakes, size, val) {

		var smap = [];
		for( var y = 0; y < size.y; y++) {
			smap.push([]);
			for(var x = 0; x < size.x; x++) {
				smap[y].push(0);
			}
		}
		for(var id in snakes) {
			for(var coord of snakes[id].coords) {
				smap[coord[1]][coord[0]] = val;
			}
		}
		return smap;
	}

	function renderWalls(map, walls, val){

		for(var coord of walls) {
			map[coord[1]][coord[0]] = val;
		}

		return map;
	}

	// shortens snake from the perspective of id
	function shortenAs(map, snakes, sid, val) {

		var smap = [];
		for(var y = 0; y < map.length; y++) {
			smap.push([]);
			for(var x = 0; x < map[0].length; x++) {
				smap[y][x] = map[y][x];
			}
		}
		var ourCoords = snakes[sid].coords[0];

		// shorten each snake
		for(var id in snakes){

			var growing = 0;
			if(snakes[id].coords.length > new Set(snakes[id].coords.map(x=>x.toString())).size)
				growing = 1;

			var coords = snakes[id].coords.filter(function(coord, index, array) {	
				// +growing to buffer on whether the snake eats food soon
				return distance(ourCoords, coord) >= array.length - index + growing;
			});

			coords.forEach(function(loc) {
				smap[loc[1]][loc[0]] = val;
			});
		}

		return smap;
	}

	// adds movement probabilities from the perspective of id
	function headsAs(map, snakes, sid, val) {
		
		var size =  {x:map[0].length, y:map.length};

		var smap = [];
		for(var y = 0; y < map.length; y++) {
			smap.push([]);
			for(var x = 0; x < map[0].length; x++) {
				smap[y][x] = map[y][x];
			}
		}

		var sval;

		for(var id in snakes){

			sval = val;

			// don't block our own snake
			if(id == sid) continue;

			// try to kill snakes?
			if(snakes[id].coords.length < snakes[sid].coords.length)
				sval = -val/2;

			var x = snakes[id].coords[0][0];
			var y = snakes[id].coords[0][1];

			// adjacent squares
			if(x + 1 < size.x){
				smap[y][x + 1] += sval;
			}
			if(x - 1 >= 0){
				smap[y][x - 1] += sval;
			}
			if(y + 1 < size.y){
				smap[y + 1][x] += sval;
			}
			if(y - 1 >= 0){
				smap[y - 1][x] += sval;
			}

			// kitty corners
			if(x + 1 < size.x && y + 1 < size.y)
				smap[y + 1][x + 1] += sval/2;
			if(x + 1 < size.x && y - 1 >= 0)
				smap[y - 1][x + 1] += sval/2;
			if(x - 1 >= 0 && y + 1 < size.y)
				smap[y + 1][x - 1] += sval/2;
			if(x - 1 >= 0 && y - 1 >= 0)
				smap[y - 1][x - 1] += sval/2;
		}

		return smap;

	}

	// this is to help with being more agressive. 
	// We can find how to block other snakes in
	// based on which node they're in, and how that connects to others.
	function findGraph(map, snakes, buff){
		var buffered = [];
		var i,j, ii, jj;
		var left, right, above, below;
		var set = 0;

		for(j = 0; j < map.length; j++){
			buffered.push([]);
			for(i = 0; i < map[0].length; i++) {
				left = i - buff >= 0 ? i - buff : 0;
				right = i + buff + 1 <= map[0].length ? i + buff + 1: map[0].length;
				above = j - buff >= 0 ? j - buff : 0;
				below = j + buff + 1 <= map.length ? j + buff + 1: map.length;
				set = 0;

				for(jj = above; jj < below; jj++) {
					for(ii = left; ii < right; ii++) {
						if(map[jj][ii] == 1) {
							set = 1;
						}
					}
				}
				buffered[j].push(set);
			}
		}
		//console.dir(map);
		//console.log();
		//console.dir(buffered);
		//console.log();

		// make space adjacent to heads
		var head;
		for(snake of snakes) {
			head = toXY(snake.coords[0]);
			// adjacent squares
			if(head.x + 1 < map[0].length){
				buffered[head.y][head.x + 1] = map[head.y][head.x + 1];
			}
			if(head.x - 1 >= 0){
				buffered[head.y][head.x - 1] = map[head.y][head.x - 1];
			}
			if(head.y + 1 < map.length){
				buffered[head.y + 1][head.x] = map[head.y + 1][head.x];
			}
			if(head.y - 1 >= 0){
				buffered[head.y - 1][head.x] = map[head.y - 1][head.x];
			}
		}

		//console.dir(buffered);

		// union find on it
		var graph = [];

		var nodes = [];
		var leftNode, aboveNode;
		var newNode;
		// find
		for(j = 0; j < map.length; j++){
			for(i = 0; i < map[0].length; i++) {
				var node = -1;
				if(buffered[j][i] == 0) {
					leftNode = null;
					aboveNode = null;

					if(i > 0) {
						leftNode = buffered[j][i - 1] == 1 ? null : buffered[j][i - 1];
					}
					if(j > 0) {
						aboveNode = buffered[j - 1][i] == 1 ? null : buffered[j - 1][i];
					}

					if(leftNode == null && aboveNode == null) {
						newNode = {x:i,y:j, members:[], edges:[], snakes: new Set()};
						nodes.push(newNode);
						buffered[j][i] = newNode;
					} else if( leftNode == null) {
						buffered[j][i] = aboveNode;
					} else if( aboveNode == null) {
						buffered[j][i] = leftNode;
					} else {
						// union
						if(aboveNode != leftNode) {
							var keep   = aboveNode.members.length >  leftNode.members.length ? aboveNode : leftNode;
							var change = aboveNode.members.length <= leftNode.members.length ? aboveNode : leftNode;

							for(var nd of change.members) {
								buffered[nd.y][nd.x] = keep;
								keep.members.push(nd);
							}
							nodes = nodes.filter(function(n){return n != change});
						}
						buffered[j][i] = buffered[j][i - 1];
					}

					buffered[j][i].members.push({x:i,y:j});
				}
			}
		}

		var edges = [];
		var edgesMap = [];
		for(j = 0; j < map.length; j++){
			edgesMap.push([]);
			for(i = 0; i < map[0].length; i++) {
				edgesMap[j].push(0);

			}
		}
		// find edges
		for(var nd1 of nodes) {
			for(var nd2 of nodes) {
				if(nd1 == nd2) continue;

				//initialise the map
				for(j = 0; j < map.length; j++){
					for(i = 0; i < map[0].length; i++) {
						edgesMap[j][i] = map[j][i];
					}
				}

				// block off the other nodes
				for(var nd3 of nodes) {
					if(nd3 == nd1 || nd3 == nd2) continue;
					for(mem of nd3.members) {
						edgesMap[mem.y][mem.x] = 1;
					}
				}

				// check for a path
				if(findPath(edgesMap, [nd1.x,nd1.y], [nd2.x,nd2.y], 0.5).length > 2) {
					edges.push([nd1,nd2]);
					nd1.edges.push(nd2);
				}
			}
		}

		for(var i = 0; i < nodes.length; i++) {
			nodes[i].name = i+3;
		}
		for(var node of nodes) {
			node.edges.sort(function(a,b){a.name - b.name});
		}

		// add the buffered out grid points to the nearby node.
		for(j = 0; j < map.length; j++){
			for(i = 0; i < map[0].length; i++) {
				nameBuffered(buff, map, buffered, i, j);
			}
		}

		// add the heads to the nodess they could be in
		var head;
		for(snake of snakes) {
			head = toXY(snake.coords[0]);
			// adjacent squares
			if(head.x + 1 < map[0].length){
				if(buffered[head.y][head.x + 1] != 1){
					buffered[head.y][head.x + 1].snakes.add(snake.id);
				}
			}
			if(head.x - 1 >= 0){
				if(buffered[head.y][head.x - 1] != 1) {
					buffered[head.y][head.x - 1].snakes.add(snake.id);
				}
			}
			if(head.y + 1 < map.length){
				if(buffered[head.y + 1][head.x] != 1) {
					buffered[head.y + 1][head.x].snakes.add(snake.id);
				}
			}
			if(head.y - 1 >= 0){
				if(buffered[head.y - 1][head.x] != 1) {
					buffered[head.y - 1][head.x].snakes.add(snake.id);
				}
			}
		}


		// render the map for viewing
		for(j = 0; j < map.length; j++){
			for(i = 0; i < map[0].length; i++) {
				buffered[j][i] = map[j][i];
			}
		}

		for(var node of nodes) {
			for(mem of node.members) {
				buffered[mem.y][mem.x] = node.name;
			}
		}

		// add the heads to the nodess they could be in
		var head;
		for(snake of snakes) {
			head = toXY(snake.coords[0]);
			// adjacent squares
			if(head.x + 1 < map[0].length){
				if(buffered[head.y][head.x + 1] != 1){
					buffered[head.y][head.x + 1].snakes.add(snake.id);
				}
			}
			if(head.x - 1 >= 0){
				if(buffered[head.y][head.x - 1] != 1) {
					buffered[head.y][head.x - 1].snakes.add(snake.id);
				}
			}
			if(head.y + 1 < map.length){
				if(buffered[head.y + 1][head.x] != 1) {
					buffered[head.y + 1][head.x].snakes.add(snake.id);
				}
			}
			if(head.y - 1 >= 0){
				if(buffered[head.y - 1][head.x] != 1) {
					buffered[head.y - 1][head.x].snakes.add(snake.id);
				}
			}
		}

		console.log(buffered);
		console.log();

		// need to find connected components so we can effectively do dfs (union/find!)

		var uf = new UnionFind(nodes.length);

		for(var nd1 of nodes) {
			for(var nd2 of nd1.edges) {
				if( !uf.connected(nd1.name-3, nd2.name-3) ){
					uf.union(uf.find(nd1.name-3), uf.find(nd2.name-3));
				}
			}
		}
		var roots = new Set();
		for(var nd1 of nodes) {
			roots.add(uf.find(nd1.name -3)+3);
		}
		return {nodes: nodes, edges: edges, roots:roots};

	}

	function nameBuffered(buff, map, buffered, i, j) {
		var left = i - buff >= 0 ? i - buff : 0;
		var right = i + buff + 1 <= map[0].length ? i + buff + 1: map[0].length;
		var above = j - buff >= 0 ? j - buff : 0;
		var below = j + buff + 1 <= map.length ? j + buff + 1: map.length;

		var buffed = [];
		var buffedSet = new Set();
		var possibilities = new Set();

		if(map[j][i] == 0 && buffered[j][i] == null ) {
			for(jj = above; jj < below; jj++) {
				for(ii = left; ii < right; ii++) {
					if(map[j][i] == 0 && buffered[jj][ii] != null) {
						if(isBySnake(buff, map, ii, jj)) {
							possibilities.add(buffered[jj][ii]);
						} else {
							buffedSet.add(buffered[jj][ii]);
						}
					} else if(map[j][i] == 0) {
						buffed.push({x:ii,y:jj});
					}
				}
			}
		}

		var possibilitiesList = [...possibilities];
		var buffedSetList = [...buffedSet];
		var recurse = false;
		var chosenNode = null;

		switch(possibilitiesList.length) {
			case 0:
				if(buffedSetList>0){
					chosenNode = buffedSetList[0];
				}
				break;

			case 1:
				chosenNode = possibilitiesList[0];
				break;

			default:
				chosenNode = possibilitiesList[0];
				console.log("buffered could be more than one thing? how?")
				break;
		}

		if(chosenNode != null) {
			buffered[j][i] = chosenNode;
			buffered[j][i].members.push({x:i,y:j});

			for(var loc of buffed) {
				nameBuffered(buff, map, buffered, loc.x, loc.y);
			}
		}
	}

	function isBySnake(buff, map, i, j) {
		var left = i - buff >= 0 ? i - buff : 0;
		var right = i + buff + 1 <= map[0].length ? i + buff + 1: map[0].length;
		var above = j - buff >= 0 ? j - buff : 0;
		var below = j + buff + 1 <= map.length ? j + buff + 1: map.length;
		for(jj = above; jj < below; jj++) {
			for(ii = left; ii < right; ii++) {
				if(map[jj][ii] == 1) {
					return true;
				}
			}
		}
		return false;
	}

	function dfs(graph) {

	var nodes = graph.nodes;
	var stack = [];
	var visited = new Map();
	var current;
	var i = 1;
	var parent;
	var vals;

	for(var nd of graph.roots) {

		stack.push({parent: nd, next: nodes.find(function(node){return node.name == nd})})
	}

	while(visited.size < nodes.length) {
		
		vals = stack.shift();
		current = vals.next;
		parent = vals.parent;

		var candidates = current.edges.map(function(a){return {parent: current.name, next: a}})
		var frontier = candidates.filter(function(a){return !visited.has(a.next.name)})
		frontier.push(...stack);
		stack = frontier;

		var back = candidates.filter(function(a){return visited.has(a.next.name) && a.next.name != parent})

		visited.set(current.name,  {i: i, parent: vals.parent, back: back, children:[], snakes: current.snakes, edges: current.edges, members: current.members});
		
		i++;
		if(stack.length == 0) break;
	}

	for(var child of visited){
		parent = visited.get(child[1].parent);
		if(child[1] != parent) {
			parent.children.push(child[0]);
		}
	}

	function denom(name) {
		var vals = visited.get(name);
		if(vals.denom)
			return vals.denom;
		var minBack = vals.i;
		for(var back of vals.back) {
			var valsBack = visited.get(back.next.name);
			if(valsBack.i < minBack) {
				minBack = valsBack.i;
			}
		}
		var minChild = vals.i;
		for(var child of vals.children) {
			var valsChild = visited.get(child);
			var denomChild = denom(child);
			if(denomChild < minChild) {
				minChild = denomChild;
			}
		}
		vals.denom = Math.min(vals.i, minBack, minChild)

		return vals.denom;

	}

	for(var node of visited){
		node[1].denom = denom(node[0]);
	}

	for(var node of visited) {
		if(node[0] == node[1].parent) {
			if(node[1].children.length > 1) {
				node[1].cut = true;
			}
		} else {
			for(var child of node[1].children) {
				var valsChild = visited.get(child);
				if(valsChild.denom > node[1].i){
					node[1].cut = true;
				}
			}
		}

		if(!node[1].cut) {
			node[1].cut = false;
		}
	}
	console.dir([...visited].map(function(x){return{name: x[0], cut: x[1].cut, edges: x[1].edges.map(y=>y.name), size: x[1].members.length}}));

	return visited;
}

	return predict;

}

module.exports = preprocessor();
