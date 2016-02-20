
// converts input into interesting stuff
var Promise = require('bluebird');

module.exports = function(){

	var size = {x:0, y:0};

	return {
		init: function(x,y) {
			size.x = x;
			size.y = y;
		},
		predict: function(in) {
			
		}
	}

}