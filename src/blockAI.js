var config = require('../config.json');
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;
var findSafePath = require('./core.js').findSafePath;
var UnionFind = require('unionfind');

module.exports = function(data) {

	// advanced block
	if(data.snakes[data.you].health_points > 40) {
		console.log("advanced block")
		// check conditions:
		// * there are cut edges adjancent to our nodes
		// * they are small (members<4^2)
		// * they contain other snakes

		// names are shifted up by 3
		var uf = new UnionFind(data.dfs.size);
		for(var node of data.dfs) {
			if(node[1].cut) continue;
			for(edge of node[1].edges) {
				if(edge.cut) continue;

				if(uf.connected(node[0]-3, edge.name-3)) continue;

				uf.union(node[0]-3, edge.name-3);
			}
		}
		// now uf should be what's connected when yuu take out the cut nodes

		//find ours

		var ours = [];
		var oursNames = new Set();
		for(var node of data.dfs) {
			if(node[1].snakes.has(data.you)) {
				ours.push({name:node[0], adj:new Set()});
				oursNames.add(node[0]);
			}
		}


		// find appropriate adjacents
		var adjs;
		for(var node of ours) {
			adjs = data.dfs.get(node.name).edges;
			for(var adj of adjs) {

				// it cuts a subgraph, need to check for snakes in the subgraph
				if(adj.cut) {
					console.log(adj.name);

					toVisit = new Set([adj.edges.map(x=>x.name)]);
					visited = new Set(adj.name);

					// gather all the relevant nodes
					for(var nd of toVisit) {
						if(!uf.connected(nd-3, node.name-3)) {
							visited.add(nd);
							toVisit.add(data.dfs.get(nd).edges.map(x=>x.name));
						}
					}
					console.log(visited);

					var snakes = new Set();
					var s;
					for(nd of visited) {
						s = data.dfs.get(node.name).snakes;
						for(snake of s) {
							snakes.add(snake);
						}
					}
					console.log(snakes);
					if(snakes.size > 0 + (snakes.has(data.you) ? 1 : 0)){
						node.adj.add(adj.name);
					}

				}
				// its a leaf
				if(adj.edges.length == 1) {
					if(adj.snakes.size > 0 + (adj.snakes.has(data.you) ? 1 : 0)) {
						node.adj.add(adj.name);
					}
				}
			}
		}
		console.log("found:");
		console.log(ours);

		// calculate the closest distance
		var m1, m2, xy1, xy2;
		var n1, n2;
		var length;
		var m1xy = null;
		var m2xy = null;
		var minLength = 50000000; // for tracking the minimum, and where we need to go
		for(n1 of ours) {
			m1 = data.dfs.get(n1.name).members;
			for(n2 of n1.adj) {
				m2 = data.dfs.get(n2).members;

				for(xy1 of m1) {
					if(findSafePath(data.pmap, snake.coords[0], [xy1.x,xy1.y], snake.coords[snake.coords.length - 1], 0.3).length > 0) {
						for(xy2 of m2) {
							length = findPath(data.pmap, [xy1.x,xy1.y],[xy2.x,xy2.y], 0.3).length;
							if(length < minLength && length > 0) {
								length = minLength;
								m1xy = xy1;
								m2xy = xy2;
							}
						}
					}
				}
			}
		}

		if(m1xy) {
			console.log("found advanced block")
			data.target = m1xy;
			return data;
		}

	}

	var cuts = [];
	for(var node of data.dfs) {
		if(node[1].cut && node[1].members.length < 12 + (data.snakes[data.you].coords.length /4) && node[1].snakes.has(data.you)){
			if(findSafePath(data.pmap, snake.coords[0], cuts[0].members[0], snake.coords[snake.coords.length - 1], 0.3).length > 0) {
				cuts.push(node[1]);
			}
		}
	}

	if(cuts.length < 1) {
		throw "no easy blocks";
	}
	data.cutoff = 0.3;
	cuts.sort(function(a,b){b.edges.length - a.edges.length});

	data.target = cuts[0].members[0];

	return data;
}