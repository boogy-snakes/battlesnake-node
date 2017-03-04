// basic ai, just finds the closest food
var findSafePath = require('./core').findSafePath;
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
        var path;
        if(snake == data.snakes[data.you]) {
          path = findPath(snake.map, snake.coords[0], f, 0.5);
        }
        else {
          path = findSafePath(snake.map, snake.coords[0], f, snake.coords[snake.coords.length - 1], 0.5);
        }

        if(path.length == distances[f].length) {
          console.log("path lengths equal")
            if(snake.coords.length > distances[f].snakeLength) {
              console.log('length difference')
                distances[f].snake = id;
                distances[f].length = path.length;
                distances[f].snakeLength = snake.coords.length;
                distances[f].path = path;
            } else if(distances[f].snake == data.you) {
                console.log('our snake should avoid it')
                distances[f].snake = id;
                distances[f].length = path.length;
                distances[f].snakeLength = snake.coords.length;
                distances[f].path = path;
            }

        } else if( path.length < distances[f].length) {
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
      if(distances[d].snake == data.you) {
        ourDistances.push({dist: distances[d].length, loc:d.split(','), path: distances[d].path});

      //make sure we don't go to ones that are about to be filled
      } else {
        pr = 0.4
        for(var i = 0; i < distances.length; i++) {
          pr -= 0.05;
          if(pr <= 0)
            break;
          data.snakes[data.you].map[loc[1]][loc[0]] += pr;
        }
      }
    }

    ourDistances = ourDistances.sort(function(a,b){
      if(a.dist > b.dist) return 1;
      if(a.dist < b.dist) return -1;
      return 0;
    })

    var minDistance = ourDistances[0];
    if(minDistance) {
      data.target = toXY(minDistance.loc);
    }
    else {
      throw "no food";
    }

    return data;
  }
};
