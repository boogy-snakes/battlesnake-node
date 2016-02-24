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
		//return food(data);
		return wander(data);
	}
	catch(e) {
		console.log(e);
		console.log(e.stack);
		try{
			return wander(data);
		}
		catch(e){
			console.log(e);
			console.log(e.stack);

			try{
				return tail(data);
			}
			catch(e) {
				console.log(e);
				console.log(e.stack);
				data.target = {x: Math.round(data.width/2), y:Math.round(data.height/2)};
				return data;
			}
		}
	}
};
