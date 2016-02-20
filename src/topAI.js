// receives preprocessed data, and decides on an ai to use

var food = require('./basicAI.js');

module.exports = function(processed){

	return food(processed);
};
