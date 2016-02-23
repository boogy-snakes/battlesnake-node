// pathfinds to its tail
var findPath = require('./core').findPath;
var config = require('../config.json');
var _ = require('underscore');

module.exports = function(data) {

	snake = _.where(data.snakes, {id: config.snake.id})[0];

	var path = findPath(snake.coords[0], snake.coords[snake.length], data, 0.5);

	if (path.length == 0) 
		throw "can't make it to the tail"

	return {x:path[1][0], y: path[1][1]};
}

