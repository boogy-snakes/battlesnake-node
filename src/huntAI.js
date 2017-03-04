
var findSafePath = require('./core').findSafePath;
var toXY = require('./core').toXY;
var config = require('../config.json');

module.exports = function(data) {

	var snake = data.snakes[data.you];


	// most basic, go for their heads!

	var smin = null;
	var minl = 99999999999;

	for(var s of data.snakes) {
		var path = findSafePath(snake.map, snake.coords[0], s.coords[0], snake.coords[snake.coords.length - 1], 0.5);
		if(path.length == 0) continue;

		if(path.length < minl){
			smin = s;
			minl = path.length;
		}
	}

	if(!smin) throw "can't target a snake head"

	data.target = toXY(smin.coords);

	return data;
}



