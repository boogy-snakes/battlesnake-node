module.exports = function(data) {
  var current = data.current;
  var pmap = data.pmap;

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

  var sd = Object.keys(distances).sort(function(a,b){
    if(distances[a] > distances[b]) return 1;
    if(distances[a] < distances[b]) return -1;
    return 0;
  });

  if(sd[0] == sd[1] || sd[0] < 2) throw "can't decide which direction is better";


  // Get maximum distance in distances
  var direction = Object.keys(distances).reduce(function(a, b) {
    return distances[a] > distances[b] ? a : b
  });

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
