// receives preprocessed data, and decides on an ai to use

var food = require('./basicAI.js').findClosestFood;

module.exports = function(processed){
	try{
		return food(processed);
	}
	catch(e) {
		console.log(e);
	}
};