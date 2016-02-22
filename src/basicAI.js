// basic ai, just finds the closest food
var findPath = require('./core').findPath;
var config = require('../config.json');
var _ = require('underscore');

module.exports = {
  findClosestFood: function(data) {
    var distances = {};

    for(var f of data.food) {
      distances[f] = { snake: null, length: Infinity, snakeLength: 0};

      for(var snake of data.snakes) {
          var path = findPath(snake.coords[0], f, data, 0.5);

          console.log(path.length, distances[f].length, snake.coords.length, distances[f].snakeLength);
          
          if(path.length == distances[f].length) {
            console.log("path lengths equal")
              if(snake.coords.length > distances[f].snakeLength) {
                console.log('length difference')
                  distances[f].snake = snake.id;
                  distances[f].length = path.length;
                  distances[f].snakeLength = snake.coords.length;
              } else if(distances[f].snake == config.snake.id) {
                  console.log('our snake should avoid it')
                  distances[f].snake = snake.id;
                  distances[f].length = path.length;
                  distances[f].snakeLength = snake.coords.length;
              }

          } else if( path.length < distances[f].length) {
            console.log('difference in lengths')
            distances[f].snake = snake.id;
            distances[f].length = path.length;
            distances[f].snakeLength = snake.coords.length;
          }
      }
    }

    console.dir(distances);
    var loc;
    var ourDistances = [];
    for(var d in distances) {
      if(distances[d].snake = config.snake.id) {
        ourDistances.push({dist: distances[d].length, loc:d});
      //make sure we don't go to ones that are abut to be filled
      } else if(distances[d].length <= 2) {
        loc = d.split(',');
        data.pmap[loc[1]][loc[0]] = 1;
      }
    }

    ourDistances = _.sortBy(ourDistances, "dist");

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
