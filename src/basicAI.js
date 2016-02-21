// basic ai, just finds the closest food
var findPath = require('./core').findPath;
var config = require('../config.json');

module.exports = {
  findClosestFood: function(data) {
    var distances = {};

    for(var f of data.food) {
      distances[f] = { snake: null, length: Infinity};

      for(var snake of data.snakes) {
          var path = findPath(snake.coords[0], f, data, 0.5);
          if( path.length < distances[f].length) {
            distances[f].snake = snake.id;
            distances[f].length = path.length;
          }
      }
    }

    var ourDistances = [];
    for(var d in distances) {
      if(distances[d].snake = config.snake.id) {
        ourDistances.push({dist: d.length, loc:d});
      }
    }

    ourDistances = ourDistances.sort(function(p, q) {
      console.dir(p);
      console.dir(q);
      return p.dist < q.dist
    });
    console.log(ourDistances);

    var minDistance = ourDistances[0];
    if(minDistance) {
      minDistance.loc = minDistance.loc.split(',');
      data.target = { x: minDistance.loc[0], y: minDistance.loc[1] };
    }
    else {
      throw "no food";
    }

    return data;
  }
};
