
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

		console.log(current, target);
		console.log(map.length, map[0].length);

		map[current.y][current.x] = "A";
		map[target.y][target.x] = "B";
		console.log(map);

		var path = finder.findPath(current.x, current.y, target.x, target.y, grid);

		// no path found, choose an open direction?
		if(path.length < 2) {
			console.log("no path found! uh oh!")
			console.log(current.x, current.y)
			console.log(target.x, target.y)

			dirs = [];

			
			if(current.x + 1  < map[0].length && map[current.y][current.x + 1] < 1) {
				dirs.push({d:"east", v: map[current.y][current.x + 1]});
			}
			if(current.x - 1  >= 0  && map[current.y][current.x - 1] < 1) {
				dirs.push({d:"west", v: map[current.y][current.x - 1]});
			}
			if(current.y + 1  < map.length && map[current.y + 1][current.x] < 1) {
				dirs.push({d:"south", v: map[current.y + 1][current.x]});
			}
			if(current.y - 1  >= 0 && map[current.y - 1][current.x] < 1) {
				dirs.push({d:"north", v: map[current.y - 1][current.x]});
			}
			dirs.push({d:"north", v: 1});

			dirs.sort(function(a,b){return a.v-b.v});

			return dirs[0].d;

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