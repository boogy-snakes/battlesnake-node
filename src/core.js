var pf = require('pathfinding');

var finder = new pf.AStarFinder({
        allowDiagonal: false,
        dontCrossCorners: true,
        heuristic: pf.Heuristic.chebyshev
      });

function safeFinder(startX, startY, endX, endY, safeX, safeY,grid) {
    var Heuristic = pf.Heuristic;
    var DiagonalMovement = pf.DiagonalMovement;
    var Heap = pf.Heap;
    var Util = pf.Util;

    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = Heuristic.chebyshev,
        diagonalMovement = DiagonalMovement.Never,
        weight = 1,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {

                // check if there's a path back to the tail
                var potentialGrid = grid.clone();
                var currentPath = Util.backtrace(node);
                for(var loc of currentPath) {
                  potentialGrid.setWalkableAt(loc[0], loc[1], false);
                }
                var path = finder.findPath(neighbor.x, neighbor.y, safeX, safeY, potentialGrid);
                var extraWeight = 0;
                if(path.length < 0) {
                  extraWeight = 1;
                }

                neighbor.g = ng;
                neighbor.h = neighbor.h || (weight * heuristic(abs(x - endX), abs(y - endY)) + extraWeight*(heuristic(abs(x - endX), abs(y - endY)/2 + 2)));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
  };

module.exports = {
  findPath: function(map, current, target, cutoff) {
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
  toXY: function(coord){return {x: coord[0], y:coord[1]}},

  safeFinder: safeFinder,
  
  safeFindPath: function(map, current, target, safe, cutoff) {

      var finder = new pf.AStarFinder({
        allowDiagonal: false,
        dontCrossCorners: true,
        heuristic: pf.Heuristic.chebyshev
      });

      var size = {x: map[0].length, y: map.length};
      var grid = new pf.Grid(size.x, size.y);

      map[safe[1]][safe[0]] = 0;

      // Set walls
      for(var x = 0; x < size.x; x++) {
        for(var y = 0; y < size.y; y++) {
          if(map[y][x] > cutoff) {
            grid.setWalkableAt(x, y, false);
          }
        }
      }

      // Calculate path
      var path = safeFinder(current[0], current[1], target[0], target[1], safe[0], safe[1], grid);
    return path;
  }

}
