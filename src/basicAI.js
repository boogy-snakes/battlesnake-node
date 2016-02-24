// basic ai, just finds the closest food
var findPath = require('./core').findPath;
var toXY = require('./core').toXY;
var config = require('../config.json');

module.exports = {
  findClosestFood: function(data) {
    var distances = {};
    var snake;

    for(var f of data.food) {
      distances[f] = { snake: null, length: Infinity, snakeLength: 0, path: []};

      for(var id in data.snakes) {

        snake = data.snakes[id];
        var path = findPath(snake.map, snake.coords[0], f, 0.5);

        if(path.length == distances[f].length) {
          console.log("path lengths equal")
            if(snake.coords.length > distances[f].snakeLength) {
              console.log('length difference')
                distances[f].snake = id;
                distances[f].length = path.length;
                distances[f].snakeLength = snake.coords.length;
                distances[f].path = path;
            } else if(distances[f].snake == config.snake.id) {
                console.log('our snake should avoid it')
                distances[f].snake = id;
                distances[f].length = path.length;
                distances[f].snakeLength = snake.coords.length;
                distances[f].path = path;
            }

        } else if( path.length < distances[f].length) {
          console.log('difference in lengths')
          distances[f].snake = id;
          distances[f].length = path.length;
          distances[f].snakeLength = snake.coords.length;
          distances[f].path = path;
        }
      }
    }

    var pr = 0;
    var ourDistances = [];
    for(var d in distances) {
      if(distances[d].snake == config.snake.id) {
        ourDistances.push({dist: distances[d].length, loc:d});
      //make sure we don't go to ones that are abut to be filled
      } else {
        pr = 0.3
        for(var i = 0; i < distances.length; i++) {
          pr -= 0.05;
          if(pr <= 0)
            break;
          data.pmap[loc[1]][loc[0]] += pr;
        }
      }
    }

    ourDistances = ourDistances.sort(function(a,b){
      if(a > b) return 1;
      if(a < b) return -1;
      return 0;
    })

    var minDistance = ourDistances[0];
    if(minDistance) {
      minDistance.loc = minDistance.loc.split(',');
      data.target = toXY(minDistance.loc);
    }
    else {
      throw "no food";
    }

    return data;
  }
};
