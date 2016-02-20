
//converts ai into a direction (runs pathfinding, returns a direction)

var pf = require('pathfinding');
var Promise = require('bluebird');

pf = Promise.promisifyAll(pf);

module.exports  = function(){

	var size = {x:0, y:0};

	return {
		init: function(x,y) {
			size.x = x;
			size.y = y;
		},
		direct: function(res) {
			
		}
	};

};