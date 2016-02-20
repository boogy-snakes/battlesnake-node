
ps = require('../src/postprocessor.js')();

var map = [
	[0,0,0,1,0,.4,.5,0,1],
	[0,0,1,1,0,1,.5,0,1],
	[0,1,0,0,0,0,.1,0,1],
	[0,0,0,1,0,1,.5,0,1],
	[.2,0,0,1,0,.5,.5,0,1]
	];

ps.init(map[0].length, map.length);

var dir;

var current = {x: 2, y:0};
var target = {x: 7, y:4};

dir = ps.direct(map, current, target, 0.3);

console.log(dir);
