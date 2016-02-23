// receives preprocessed data, and decides on an ai to use

var food = require('./basicAI.js').findClosestFood;
var wander = require('./wanderAI.js');
var tail = require('./followTailAI.js');
var initAvoid = require('./initAvoidAI.js');

module.exports = function(processed){
	
	if(processed.turn < 2) {
		return initAvoid(processed);
	}

	try{
		return food(processed);
	}
	catch(e) {
		console.log(e);
		try{
			return wander(processed);
		}
		catch(e){
			console.log(e);

			try{
				return followTail(processed);
			}
			catch(e) {
				console.log(e);
				return {x: Math.round(processed.width/2),y:Math.round(processed.height/2)};
			}
		}
	}
};
