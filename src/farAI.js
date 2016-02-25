var findPath = require('./core').findPath;
var toXY = require('./core').toXY;
var config = require('../config.json');

module.exports = function(data) {
	var snake = data.snakes[config.snake.id];

	var max = {x:0, y:0};
	var maxl = 0;
	paths = [];
	for(var y = 0; y < data.height; y++) {
		paths.push([]);
		for(var x = 0; x < data.width; x++) {
			paths[y][x] = findPath(snake.map, snake.coords[0], [x,y], 0.4);
			if(paths[y][x].length > maxl) {
				max.x  = x;
				max.y = y;
				maxl = paths[y][x].length;
			}
		}
	}
	data.target = max;
	return datas;
}