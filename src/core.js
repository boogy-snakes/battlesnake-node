var pf = require('pathfinding');

module.exports = {
  findPath: function(current, target, data, cutoff) {
      var finder = new pf.AStarFinder({
        allowDiagonal: false,
        dontCrossCorners: true,
        heuristic: pf.Heuristic.chebyshev
      });

      var size = {x:data.width, y:data.height};
      var grid = new pf.Grid(size.x, size.y);

      // Set walls
      for(var x = 0; x < size.x; x++) {
        for(var y = 0; y < size.y; y++) {
          if(data.pmap[y][x] > cutoff) {
            grid.setWalkableAt(x, y, false);
          }
        }
      }

      // Calculate path
      var path = finder.findPath(current[0], current[1], target[0], target[1], grid);
      console.log(path);
    return path;
  }
}
