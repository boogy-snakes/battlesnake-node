var config = require('../config.json');
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;

module.exports = function(data) {
	

	// advanced block
	if(data.snakes[config.snake.id].health > 30) {

		// check conditions:
		// * there are cut edges adjancent to our nodes
		// * they are small (members<4)
		// * they contain other snakes

		//find ours

		var ours = [];
		for(node of data.dfs) {
			if(node[1].snakes.has(config.snake.id) && node[1].cut)
				ours.push({name:node[0], adj:[]});
		}


		// find appropriate adjacents
		var adjs;
		for(var node of ours) {
			adjs = data.dfs.get(node.name).edges;
			for(var adj of adjs){
				if(adj.cut && adj.members.length < 4 && adj.snakes.size > 0 + (adj.snakes.has(config.snake.id) ? 1 : 0)){
					node.adj.push(adj.name);
				}
			}
		}

		console.log("advanced block")
		console.log(ours);

		// calculate the closest distance
		var m1,m2, xy1, xy2;
		var n1,n2;
		var length;
		var m1xy = null;
		var m2xy = null;
		var minLenth = 50000000; // for tracking the minimum, and where we need to go
		for(n1 of ours) {
			m1 = data.dfs.get(n1.name).members;
			for(n2 of n1.adj) {
				m2 = data.dfs.get(n2.name).members;

				for(xy1 of m1) {
					for(xy2 of m2){
						length = findPath(data.pmap, [xy1.x,xy1.y],[xy2.x,xy2.y], 0.3).length;
						if(length < minLength && length > 0){
							length = minLength;
							m1xy = xy1;
							m2xy = xy2;
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
		if(node[1].cut && node[1].members.length < 4 + (data.snakes[config.snake.id].coords.length /4) && node[1].snakes.has(config.snake.id)){ 
			cuts.push(node[1]);
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