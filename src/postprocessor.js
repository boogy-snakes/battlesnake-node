
//converts ai into a direction (runs pathfinding, returns a direction)

var pf = require('pathfinding');

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
			
			var grid = new pf.Grid(size.x, size.y); 

			for(var x = 0; x < size.x; x++) {
				for(var y = 0; y < size.y; y++) {
					if(map[y][x] > cutoff) {
						grid.setWalkableAt(x, y, false);
					}
				}
			}

			var path = finder.findPath(current.x, current.y, target.x, target.y, grid);

			var next = path[1];

			var h = next[0] - current.x;
			var v = next[1] - current.y;

			if(h > 0){
				return "east";
			}
			if(h < 0) {
				return "west";
			}
			if(v > 0) {
				return "south";
			}
			return "north";
		}
	}

};