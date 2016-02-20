
// converts input into interesting stuff
var Promise = require('bluebird');
var toTest = {}

function preprocessor(){

	var size = {x:0, y:0};
	var board = [[]];

	function convertBoardToMap(reqMove) {
		//dir is 0 (y) or 1 (x)
		function addN(dir, prev, curr) {
			var inity = curr[0];
			var initx = curr[1];
			var coordList = Array(Math.abs(prev[dir]-curr[dir])).fill(0);
			coordList = coordList.map(function(value, index) {
				return dir === 0 ? [index + inity, initx] : [inity, initx + index];
			});
			return coordList;
		}
		toTest.addN = addN;

		function generateCoordinateList(prev, curr) {
			if(prev[0] === curr[0]) {
				return addN(1, prev, curr);
			} else if (prev[1] === curr[1]) {
				return addN(0, prev, curr);
			}
		}
		toTest.generateCoordinateList = generateCoordinateList;

		function changeCoordinate(board, coordList, type) {
			return coordList.map(function(coordinate) {
				board[coordinate[0]][coordinate[1]] = type;
			})
		}
		toTest.changeCoordinate = changeCoordinate;


		reqMove.snakes.reduce(function(snake){
			//put snake on board by looking at coords
			snake.coords.forEach(function(curr, index, array){
				if(index === 0) return;
				var prev = array[index - 1];
				var coordList = generateCoordinateList(prev, curr);
				changeCoordinate(board, coordList, 1);
			});
		});
	}
	toTest.convertBoardToMap = convertBoardToMap;

	function init(reqStart) {
		size.x = reqStart.width;
		size.y = reqStart.height;
		board = Array(size.y).fill(0).map(row => Array(size.x).fill(0));
	}

	return {
		init: init;
		predict: function(in) {

		}
	}
}
var sampleSnakes = [
			{
			"id": "1234-567890-123456-7890",
			"name": "Well Documented Snake",
			"status": "alive",
			"message": "Moved north",
			"taunt": "Let's rock!",
			"age": 56,
			"health": 83,
			"coords": [ [1, 1], [1, 2], [2, 2] ],
			"kills": 4,
			"food": 12,
			"gold": 2
	}
]

var sampleReq = {
		"game": "hairy-cheese",
		"mode": "advanced",
		"turn": 4,
		"height": 20,
		"width": 30,
		"snakes": sampleSnakes,
		"food": [
				[1, 2], [9, 3], ...
		],
		// "walls": [    // Advanced Only
		//     [2, 2]
		// ],
		// "gold": [     // Advanced Only
		//     [5, 5]
		// ]
}

//Testing
preprocessor.init(sampleReq);
toTest.convertBoardToMap(sampleReq);
module.exports = preprocessor;
