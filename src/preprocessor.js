
// converts input into interesting stuff
var config = require('../config.json');
var distance = require('./core.js').distance;
var toXY = require('./core.js').toXY;

function preprocessor(){

	function predict(data) {

		var snakeData = {};
		for(var snake of data.snakes) {
			snakeData[snake.id] = snake;
		}

		data.current = toXY(snakeData[config.snake.id].coords[0]);
		data.pmap = renderSnakes(snakeData, {x:data.width, y:data.height}, 1);
		data.pmap = renderWalls(data.pmap, data.walls, 1);

		for(var id in snakeData) {
			snakeData[id].map = shortenAs(data.pmap, snakeData, id, 0.3);
			snakeData[id].map = headsAs(snakeData[id].map, snakeData, id, 0.4);
		}

		data.snakes = snakeData;

		return data;
	}


	// creates a map of 1s and 0s where there are blocks
	function renderSnakes(snakes, size, val) {

		var smap = [];
		for( var y = 0; y < size.y; y++) {
			smap.push([]);
			for(var x = 0; x < size.x; x++) {
				smap[y].push(0);
			}
		}
		for(var id in snakes) {
			for(var coord of snakes[id].coords) {
				smap[coord[1]][coord[0]] = val;
			}
		}
		return smap;
	}

	function renderWalls(map, walls, val){

		for(var coord of walls) {
			map[coord[1]][coord[0]] = val;
		}

		return map;
	}

	// shortens snake from the perspective of id
	function shortenAs(map, snakes, sid, val) {

		var smap = [];
		for(var y = 0; y < map.length; y++) {
			smap.push([]);
			for(var x = 0; x < map[0].length; x++) {
				smap[y][x] = map[y][x];
			}
		}
		var ourCoords = snakes[sid].coords[0];

		// shorten each snake
		for(var id in snakes){
			var coords = snakes[id].coords.filter(function(coord, index, array) {	
				// +1 to buffer on whether the snake eats food soon
				return distance(ourCoords, coord) >= array.length - index + 1;
			});

			coords.forEach(function(loc) {
				smap[loc[1]][loc[0]] = val;
			});
		}

		return smap;
	}

	// adds movement probabilities from the perspective of id
	function headsAs(map, snakes, sid, val) {
		
		var size =  {x:map[0].length, y:map.length};

		var smap = [];
		for(var y = 0; y < map.length; y++) {
			smap.push([]);
			for(var x = 0; x < map[0].length; x++) {
				smap[y][x] = map[y][x];
			}
		}

		var sval;

		for(var id in snakes){

			sval = val;

			// don't block our own snake
			if(id == sid) continue;

			// try to kill snakes?
			if(snakes[id].coords.length < snakes[sid].coords.length)
				sval = -val/2;

			var x = snakes[id].coords[0][0];
			var y = snakes[id].coords[0][1];

			// adjacent squares
			if(x + 1 < size.x){
				smap[y][x + 1] += sval;
			}
			if(x - 1 >= 0){
				smap[y][x - 1] += sval;
			}
			if(y + 1 < size.y){
				smap[y + 1][x] += sval;
			}
			if(y - 1 >= 0){
				smap[y - 1][x] += sval;
			}

			// kitty corners
			if(x + 1 < size.x && y + 1 < size.y)
				smap[y + 1][x + 1] += sval/2;
			if(x + 1 < size.x && y - 1 >= 0)
				smap[y - 1][x + 1] += sval/2;
			if(x - 1 >= 0 && y + 1 < size.y)
				smap[y + 1][x - 1] += sval/2;
			if(x - 1 >= 0 && y - 1 >= 0)
				smap[y - 1][x - 1] += sval/2;
		}

		return smap;

	}

	return predict;

}

module.exports = preprocessor();
