// receives preprocessed data, and decides on an ai to use
var food = require('./basicAI.js').findClosestFood;
var wander = require('./wanderAI.js');
var tail = require('./followTailAI.js');
var initAvoid = require('./initAvoidAI.js');
var far = require('./farAI.js');
var block = require('./blockAI.js');

var config = require('../config.json');

module.exports = function(data){
	
	if(data.turn < 2) {
		return initAvoid(data);
	}

	try {
		
		return block(data);
	}
	catch(e) {
		console.log(e);
		console.log(e.stack);
		try{

			if((data.snakes[data.you].health_points > 50 || data.snakes[data.you].coords.length > data.snakes[data.longest].coords.length - 3) && (data.snakes[data.you].health_points > 30) && (data.snakes[data.you].coords.length > 7))
				throw "let's stay small"
			
			return food(data);
		}
		catch(e) {
			console.log(e);
			console.log(e.stack);
			try{

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
	}
};
