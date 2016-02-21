// receives preprocessed data, and decides on an ai to use

var food = require('./basicAI.js').findClosestFood;
var wander = require('./wanderAI.js');

module.exports = function(processed){
	console.log(wander);
	try{
		return food(processed);
	}
	catch(e) {
		console.log(e);
		return wander(processed);
	}
};
