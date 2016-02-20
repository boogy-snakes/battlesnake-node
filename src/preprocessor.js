
// converts input into interesting stuff
var Promise = require('bluebird');
var config = require('../config.json');
var _ = require('underscore');
var toTest = {}

function preprocessor(){

	var size = {x:0, y:0};
	var board = [[]];
	toTest.board = board;

	function convertBoardToMap(reqMove) {
		console.log('In convertBoardToMap ');
		console.log(reqMove.snakes[0].coords);
		//dir is 0 (y) or 1 (x)

		function changeCoordinate(board, coordList, type) {
			return coordList.map(function(coordinate) {
				board[coordinate[0]][coordinate[1]] = type;
			})
		}
		toTest.changeCoordinate = changeCoordinate;


		reqMove.snakes.forEach(function(snake){
			function changeCoordinate(board, coordList, type) {
				return coordList.map(function(coordinate) {
					board[coordinate[0]][coordinate[1]] = type;
				})
			}
			changeCoordinate(board, snake.coords, 1);
			//put snake on board by looking at coords

		});
	}

	function getOurSnake(reqMove) {
		return _.where(reqMove.snakes, {id: config.snake.id};
	}

	toTest.convertBoardToMap = convertBoardToMap;

	function init(reqStart) {
		size.x = reqStart.width;
		size.y = reqStart.height;
		board = Array(size.y).fill(0).map(row => Array(size.x).fill(0));
	}

	return {
		init: init,
		predict: function(reqMove) {
			reqMove.pmap = convertBoardToMap(reqMove);
			reqMove.current = getOurSnake(reqMove).coords[0].map(coord => {y: coord[0], x: coord[1]}); //The head of our snake
			return reqMove;
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
				[1, 2], [9, 3]
		],
		// "walls": [    // Advanced Only
		//     [2, 2]
		// ],
		// "gold": [     // Advanced Only
		//     [5, 5]
		// ]
}
//Testing
preprocessor().init(sampleReq);
toTest.convertBoardToMap(sampleReq);
console.log(toTest.board);
module.exports = preprocessor;
