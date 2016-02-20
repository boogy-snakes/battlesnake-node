// basic ai, just finds the closest food
var findPath = require('./core').findPath;
var config = require('./config.json');

module.exports = {
  findClosestFood: function(data) {
    var distances = {};

    for(var f of food) {
      distances[f] = { snake: null, length: Infinity};

      for(var snake of snakes) {
          var path = findPath(snake, f, data, 0.5);
          if( path.length < distances[f].length) {
            distances[f].snake = snake.id;
            distances[f].length = path.length;
          }
      }

      var ourDistances = [];
      for(var d in distances) {
        if(distances[d].snake = config.snake.id) {
          ourDistances.push({dist: d.length, loc:d});
        }
      }

      ourDistances.sort((p, q) => { p.dist < q.dist });
      var minDistance = ourDistances[0];

      data.target = { x: minDistance.loc[0], y: minDistance.loc[1] };
      return data;
    }
  }
};
