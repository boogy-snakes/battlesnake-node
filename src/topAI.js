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
		return wander(data)
		//return food(data);
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
				console.log("try going to the middle")
				data.target = {x: Math.round(data.width/2), y:Math.round(data.height/2)};
				return data;
			}
		}
	}
};
