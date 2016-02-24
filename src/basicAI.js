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
        ourDistances.push({dist: distances[d].length, loc:d.split(','), path: distances[d].path});
      //make sure we don't go to ones that are about to be filled
      } else {
        pr = 0.4
        for(var i = 0; i < distances.length; i++) {
          pr -= 0.05;
          if(pr <= 0)
            break;
          data.snakes[config.snake.id].map[loc[1]][loc[0]] += pr;
        }
      }
    }

    ourDistances = ourDistances.filter(function(fd){

      var s = data.snakes[config.snake.id];
      var map = [];
      // copy the map
      for(var y = 0; y < s.map.length; y++) {
        map.push([]);
        for(var x = 0; x < s.map[0].length; x++) {
          map[y][x] = s.map[y][x];
        }
      }

      for(var i = 1; i < fd.path.length-2; i++) {
        map[fd.path[i][1]][fd.path[i][0]] = 1;
      }

      return findPath(map, fd.loc, s.coords[s.coords.length-1], 0.5).length;

    })

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
