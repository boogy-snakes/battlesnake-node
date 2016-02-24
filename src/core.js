var pf = require('pathfinding');

module.exports = {
  findPath: function(map, current, target, cutoff) {
      
      var finder = new pf.AStarFinder({
        allowDiagonal: false,
        dontCrossCorners: true,
        heuristic: pf.Heuristic.chebyshev
      });

      var size = {x: map[0].length, y: map.length};
      var grid = new pf.Grid(size.x, size.y);

      // Set walls
      for(var x = 0; x < size.x; x++) {
        for(var y = 0; y < size.y; y++) {
          if(map[y][x] > cutoff) {
            grid.setWalkableAt(x, y, false);
          }
        }
      }

      // Calculate path
      var path = finder.findPath(current[0], current[1], target[0], target[1], grid);
    return path;
  },
  distance: function(coord1, coord2) {
    //y distance + x distance
    return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
  },
  toXY: function(coord){return {x: coord[0], y:coord[1]}}

}
