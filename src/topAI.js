// receives preprocessed data, and decides on an ai to use
var food = require('./basicAI.js').findClosestFood;
var wander = require('./wanderAI.js');
var tail = require('./followTailAI.js');
var initAvoid = require('./initAvoidAI.js');

module.exports = function(data){
	
	if(data.turn < 2) {
		return initAvoid(data);
	}

	try{
		return food(data);
	}
	catch(e) {
		console.log(e);
		try{
			return wander(data);
		}
		catch(e){
			console.log(e);

			try{
				return followTail(data);
			}
			catch(e) {
				console.log(e);
				return {x: Math.round(data.width/2), y:Math.round(data.height/2)};
			}
		}
	}
};
