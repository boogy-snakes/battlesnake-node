// receives preprocessed data, and decides on an ai to use
var food = require('./basicAI.js').findClosestFood;
var wander = require('./wanderAI.js');
var tail = require('./followTailAI.js');
var initAvoid = require('./initAvoidAI.js');
var far = require('./farAI.js');

var config = require('../config.json');

module.exports = function(data){
	
	if(data.turn < 2) {
		return initAvoid(data);
	}

	try{
		return food(data);
	}
	catch(e) {
		console.log(e);
		console.log(e.stack);
		try{
			
			if(data.snakes[config.snake.id].health > 50 || data.snakes[config.snake.id].coords.length > data.snakes[data.longestSnake].coords.length - 3)
				throw "let's stay small"

			console.log("wander")
			return wander(data);
		}
		catch(e){
			console.log(e);
			console.log(e.stack);

			try{
				console.log("follow tail")
				return tail(data);
			}
			catch(e) {
				console.log(e);
				console.log(e.stack);
				console.log("go far away")
				return far(data);
			}
		}
	}
};
