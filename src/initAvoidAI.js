var config = require('../config.json');
var _ = require('underscore');


module.exports = function(data) {

	console.log("avoiding");

	var snake = _.where(data.snakes, {id: config.snake.id})[0];
	console.log(snake);

	var loc = {x:snake.coords[0][0], y: sanke.coords[0][1]};

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
		target.y  = 0;
	}
	console.log(target);

	data.target = target;

	return data;

}