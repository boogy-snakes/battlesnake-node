var config = require('../config.json');
var _ = require('underscore');


module.exports = function(data) {

	var snake = _.where(data.snakes, {id: config.snake.id})[0];

	var loc = {x:snake.coords[0], y: snke.coords[1]};
	var target = {};
	if(loc.x > data.width/2) {
		target.x = locx + 1;
	} else {
		target.x = loc.x - 1;
	}

	if(loc.y > data.height/2) {
		target.y + 1;
	} else {
		target.y - 1;
	}

	data.target = target;

	return data;

}