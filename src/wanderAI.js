var findPath = require('./core').findPath;
var config = require('../config.json');

module.exports = function(data) {
  var current = data.current;
  var pmap = data.pmap;
  var snake = data.snakes[config.snake.id];

  var distances = { n: 0, e: 0, s: 0, w: 0 };
  var paths = {n:[], e:[], s: [], w: []};

  // Calculate north distance
  var x = current.x;
  var y = current.y;
  var z = 0;
  if (y - 1 >= 0) {
    paths.n = findPath(pmap, [current.x, current.y - 1], snake.coords[snake.coords.length - 1], 0.5)
    distances.n = paths.n.length;
    while(z < 0.5) {
      y--;
      if(y < 0) break;
      z = pmap[y][x];
      distances.n++;
    }
  }

  // Calculate east distance
  x = current.x;
  y = current.y;
  z = 0;
  if (x + 1 < data.width) {
    paths.e = findPath(pmap, [current.x + 1, current.y], snake.coords[snake.coords.length - 1], 0.5);
    distances.e = paths.e.length;
    while(z < 0.5) {
      x++;
      if(x >= data.width) break;
      z = pmap[y][x];
      distances.e++;
    }
  }
  
  // Calculate south distance
  x = current.x;
  y = current.y;
  z = 0;
  if (y + 1 < data.height) {
    paths.s = findPath(pmap, [current.x, current.y + 1], snake.coords[snake.coords.length - 1], 0.5)
    distances.s = paths.s.length;
    while(z < 0.5) {
      y++;
      if(y >= data.height) break;
      z = pmap[y][x];
      distances.s++;
    }
  }
  
  // Calculate west distance
  x = current.x;
  y = current.y;
  z = 0;

  if (x - 1 >= 0) {
  paths.w = findPath(pmap, [current.x - 1, current.y], snake.coords[snake.coords.length - 1], 0.5)
    if(paths.w.length > 0){
      distances.w++;
    }
    while(z < 0.5) {
      x--;
      if(x < 0) break;
      z = pmap[y][x];
      distances.w++;
    }
  }

  // sort to check the longest distances
  var sd = Object.keys(distances).sort(function(a,b){
    if(distances[a] > distances[b]) return -1;
    if(distances[a] < distances[b]) return 1;
    return 0;
  });

  console.log(distances);

  if(distances[sd[0]] < 2) throw "not much space to wander"

  var direction;
  if(distances[sd[0]] == distances[sd[1]]) {
    throw "path lengths are equal, follow tail instead"
    direction = sd[Math.round(Math.random())];

  } else {
    direction = Object.keys(distances).reduce(function(a, b) {
      return distances[a] > distances[b] ? a : b
    });
  }

  switch(direction){
  case "n":
    data.target = {x: current.x, y: current.y-1};
    break;
  case "e":
    data.target = {x: current.x+1, y: current.y};
    break;
  case "s":
    data.target = {x: current.x, y: current.y+1};
    break;
  case "w":
    data.target = {x: current.x-1, y: current.y};
    break;
  default:
  }

  if(findPath(pmap, [current.x, current.y], [data.target.x,data.target.y], 0.3).length<=0)
    throw "path is likely blocked, try following tail"

  data.cutoff = 0.3;

  return data;
};
