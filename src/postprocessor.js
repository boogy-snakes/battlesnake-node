
//converts ai into a direction (runs pathfinding, returns a direction)

var pf = require('pathfinding');

module.exports = function(){

	var finder = new pf.AStarFinder({
		allowDiagonal: false,
		dontCrossCorners: true,
		heuristic: pf.Heuristic.chebyshev
	});

	return function(map, current, target, cutoff) {	
		var grid = new pf.Grid(map[0].length, map.length); 
		for(var x = 0; x < map[0].length; x++) {
			for(var y = 0; y < map.length; y++) {
				if(map[y][x] > cutoff) {
					grid.setWalkableAt(x, y, false);
				}
			}
		}

		var path = finder.findPath(current.x, current.y, target.x, target.y, grid);

		// no path found, choose an open direction?
		if(path.length < 2) {
			console.log("no path found! uh oh!")
			
			map[current.y][current.x] = "A";
			map[target.y][target.y] = "B";
			console.log(map);
			if(current.x + 1  < map[0].length && map[current.y][current.x + 1] < 1) {
				return "east";
			}
			if(current.x - 1  >= 0  && map[current.y][current.x - 1] < 1) {
				return "west";
			}
			if(current.y + 1  < map.length && map[current.y + 1][current.x] < 1) {
				return "south";
			}
			return "north";
		}

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

}();