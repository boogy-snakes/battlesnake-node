
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
			coordList.forEach(function(coordinate) {
				// console.log(coordinate);
				board[coordinate[0]][coordinate[1]] = type;
				// console.log(board);
			})
		}
		toTest.changeCoordinate = changeCoordinate;

		reqMove.snakes.forEach(function(snake){
			changeCoordinate(board, snake.coords, 1);
			//put snake on board by looking at coords
		});
		return board;
		// console.log(board);
	}

	function getOurSnake(reqMove) {
		var snake = _.where(reqMove.snakes, {id: config.snake.id});
		return snake[0];
	}

	toTest.convertBoardToMap = convertBoardToMap;

	function init(reqStart) {
		size.x = reqStart.width;
		size.y = reqStart.height;
		board = Array(size.y).fill(0).map(row => Array(size.x).fill(0));
	}

	function predict(reqMove) {
		reqMove.pmap = convertBoardToMap(reqMove);
		var ourCoords = getOurSnake(reqMove).coords[0]; //The head of our snake
		reqMove.current = {y: ourCoords[0], x: ourCoords[1]};
		return reqMove;
	}

	return {
		init: init,
		predict: predict
	}
}
var sampleSnakes = [
			{
			"id": "b475914e-61a4-45bf-bfd9-a31486e398d0",
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
// var preprocessor = preprocessor();
// preprocessor.init(sampleReq);
// preprocessor.predict(sampleReq);
//
// toTest.convertBoardToMap(sampleReq);
module.exports = preprocessor;
