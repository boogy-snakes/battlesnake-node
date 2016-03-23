
// converts input into interesting stuff
var config = require('../config.json');
var distance = require('./core.js').distance;
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;

function preprocessor(){

	function predict(data) {

		var longestSnake = config.snake.id;

		var snakeData = {};
		for(var snake of data.snakes) {
			snakeData[snake.id] = snake;
		}

		data.current = toXY(snakeData[config.snake.id].coords[0]);
		data.pmap = renderSnakes(snakeData, {x:data.width, y:data.height}, 1);
		data.walls = data.walls || [];
		data.pmap = renderWalls(data.pmap, data.walls, 1);

		data.graph = findGraph(data.pmap, data.snakes, 1);
		data.dfs = dfs(data.graph);

		for(var id in snakeData) {
			snakeData[id].map = shortenAs(data.pmap, snakeData, id, 0.2);
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
			var coords = snakes[id].coords.filter(function(coord, index, array) {	
				// +1 to buffer on whether the snake eats food soon
				return distance(ourCoords, coord) >= array.length - index + 1;
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
		console.dir(map);
		console.log();
		console.dir(buffered);
		console.log();

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

		console.dir(buffered);

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
								//console.log(nd);
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
				if(buffered[head.y + 1][head.x]) {
					buffered[head.y + 1][head.x].snakes.add(snake.id);
				}
			}
			if(head.y - 1 >= 0){
				if(buffered[head.y - 1][head.x] != 1) {
					buffered[head.y - 1][head.x].snakes.add(snake.id);
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

		return {nodes: nodes, edges: edges};

	}

	function dfs(graph) {

	var nodes = graph.nodes;
	var stack = [{parent: nodes[0].name, next: nodes[0]}];
	var visited = new Map();
	var current = nodes[0];
	var i = 1;
	var parent;
	var vals;

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
			console.log(valsBack);
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

	return visited;
}

	return predict;

}

module.exports = preprocessor();
