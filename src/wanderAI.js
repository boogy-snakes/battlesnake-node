var findPath = require('./core').findPath;

module.exports = function(data) {
  var current = data.current;
  var pmap = data.pmap;
  var snake = data.snakes[config.snake.id];

  var distances = { n: 0, e: 0, s: 0, w: 0 };

  // Calculate north distance
  var x = current.x;
  var y = current.y;
  var z = 0;
  while(z < 0.5) {
    y--;
    if (y < 0 || y > data.height-1) {
      break;
    }
    z = pmap[y][x];
    distances.n++;
  }
  // having the tail is handy
  if(findPath(pmap, [current.x, current.y - 1], snake.coords[snake.length], 0.5).length > 0){
    distances.n++;
  }

  // Calculate east distance
  x = current.x;
  y = current.y;
  z = 0;
  while(z < 0.5) {
    x++;
    if (x < 0 || x > data.width-1) {
      break;
    }
    z = pmap[y][x];
    distances.e++;
  }
  // having the tail is handy
  if(findPath(pmap, [current.x + 1, current.y], snake.coords[snake.length], 0.5).length > 0){
    distances.e++;
  }
  // Calculate south distance
  x = current.x;
  y = current.y;
  z = 0;
  while(z < 0.5) {
    y++;
    if (y < 0 || y > data.height-1) {
      break;
    }
    z = pmap[y][x];
    distances.s++;
  }
  // having the tail is handy
  if(findPath(pmap, [current.x, current.y + 1], snake.coords[snake.length], 0.5).length > 0){
    distances.s++;
  }
  // Calculate west distance
  x = current.x;
  y = current.y;
  z = 0;
  while(z < 0.5) {
    x--;
    if (x < 0 || x > data.width-1) {
      break;
    }
    z = pmap[y][x];
    distances.w++;
  }
  // having the tail is handy
  if(findPath(pmap, [current.x - 1, current.y], snake.coords[snake.length], 0.5).length > 0){
    distances.w++;
  }

  var sd = Object.keys(distances).sort(function(a,b){
    if(distances[a] > distances[b]) return 1;
    if(distances[a] < distances[b]) return -1;
    return 0;
  });
  console.log(sd);

  if(sd[0] < 2) throw "can't decide which direction is better";

  var direction;

  // its a tie
  if(sd[0] == sd[1]) {
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

  return data;
};
