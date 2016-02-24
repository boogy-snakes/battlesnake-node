// pathfinds to its tail
var findPath = require('./core').findPath;
var config = require('../config.json');
var toXY = require('./core').toXY;

module.exports = function(data) {

	var snake = data.snakes[config.snake.id];

	var path = findPath(snake.map, snake.coords[0], snake.coords[snake.coords.length], 0.5);

	if (path.length == 0) 
		throw "can't make it to the tail"

	data.target =  toXY(path[1]);

	return data;
}

