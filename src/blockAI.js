var config = require('../config.json');
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;

module.exports = function(data) {
	
	var cuts = [];
	for(var node of data.dfs) {
		if(node[1].cut && node[1].members.length < 4 && node[1].snakes.has(config.snake.id)){ 
			cuts.push(node[1]);
		}
	}

	if(cuts.length < 1) {
		throw "no easy blocks";
	}

	cuts.sort(function(a,b){a.edges.length - b.edges.length});
	data.target = cuts[0].members[0];

	return data;
}