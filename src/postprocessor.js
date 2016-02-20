
//converts ai into a direction (runs pathfinding, returns a direction)

var pf = require('pathfinding');
var Promise = require('bluebird');

pf = Promise.promisifyAll(pf);

module.exports  = function(){

	var finder = new pf.AStarFinder({
		allowDiagonal: false,
		dontCrossCorners: true,
		heuristic: pf.Heuristic.chebyshev
	});
	var size = {x:0, y:0};

	return {
		init: function(x,y) {
			size.x = x;
			size.y = y;
		},
		direct: function(map, current, target, cutoff) {
			
			var grid = new pf.Grid(x, y); 

			for(var i = 0; i < size.x; i++) {
				for(var j = 0; j < size.y; j++) {
					if(map[i][j] > cutoff) {
						grid.setWalkableAt(i, j, false);
					}
				}
			}

		var path = finder.find(current.x, current.y, target.x, target.y, grid);

		var next = path[1];

		var h = next[0] - current.x;
		var v = next[1] - current.y;

		
	};

};