// pathfinds to its tail
var findPath = require('./core').findPath;
var config = require('../config.json');
var toXY = require('./core').toXY;

module.exports = function(data) {

	var snake = data.snakes[data.you];

	console.log(snake.coords);

	var noFood = [];
	for(j = 0; j < snake.map.length; j++){
		noFood.push([]);
		for(i = 0; i < snake.map[0].length; i++) {
			noFood[j].push(snake.map[j][i]);
		}
	}

	for(var f of data.food) {
		noFood[f[1]][f[0]] = 1;
	}
	
	var path = findPath(noFood, snake.coords[0], snake.coords[snake.coords.length - 1], 0.3);
	if (path.length == 0) {
		path = findPath(snake.map, snake.coords[0], snake.coords[snake.coords.length - 1], 0.3);
	}

	if (path.length == 0) 
		throw "can't make it to the tail"

	data.target =  toXY(path[1]);

	return data;
}

