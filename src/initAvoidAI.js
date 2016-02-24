var config = require('../config.json');
var toXY = require('./core.js').toXY;

module.exports = function(data) {

	console.log("avoiding");

	var snake = data.snakes[config.snake.id];

	console.log(snake);

	var loc = toXY(snake.coords[0]);

	console.log(loc);
	var target = {};
	if(loc.x > data.width/2) {
		target.x = data.width - 1;
	} else {
		target.x = 0;
	}

	if(loc.y > data.height/2) {
		target.y = data.height - 1;
	} else {
		target.y = 0;
	}
	console.log(target);

	data.target = target;

	return data;

}