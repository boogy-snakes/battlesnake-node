var config = require('../config.json');
var toXY = require('./core.js').toXY;
var findPath = require('./core.js').findPath;

module.exports = function(data) {
	
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