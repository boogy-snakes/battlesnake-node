
// converts input into interesting stuff
var Promise = require('bluebird');
var config = require('../config.json');
var _ = require('underscore');
var toTest = {}

function preprocessor(){

	var size = {x:0, y:0};
	var board = [[]];

	function convertBoardToMap(reqMove) {
		function changeCoordinate(board, coordList, type) {
			coordList.forEach(function(coordinate) {
				board[coordinate[1]][coordinate[0]] = type;
			})
		}

		function distance(coord1, coord2) {
			//y distance + x distance
			return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
		}

		function shortenSnake(board, snake, type) {

			var ourCoords = getOurSnake(reqMove).coords[0];

			var coordList = snake.filter(function(coord, index, array) {
				//distance starts at 1 for nearest neighbour

				//+1 to buffer on whether the snake eats food soon
				var willDisappear = distance(ourCoords, coord) >= array.length - index + 1;
			 	if(willDisappear) {
					return true;
				} else {
					return false;
				}
			});

			coordList.forEach(function(coordinate) {
				board[coordinate[1]][coordinate[0]] = type;
			});
		}

		function addHeadProbabilities(board, snake, type){
			if(snake.id == config.snake.id)
				return;

			
			var x = snake.coords[0][0];
			var y = snake.coords[0][1];
			if(x + 1 < size.x){
				board[y][x + 1] += type;
			}
			if(x - 1 >= 0){
				board[y][x - 1] += type;
			}
			if(y + 1 < size.y){
				board[y + 1][x] += type;
			}
			if(y - 1 >= 0){
				board[y - 1][x] += type;
			}

			if(x + 1 < size.x && y + 1 < size.y)
				board[y + 1][x + 1] += type/2;
			if(x + 1 < size.x && y - 1 >= 0)
				board[y - 1][x + 1] += type/2;
			if(x - 1 >= 0 && y + 1 < size.y)
				board[y + 1][x - 1] += type/2;
			if(x - 1 >= 0 && y - 1 >= 0)
				board[y - 1][x - 1] += type/2;

		}

		reqMove.snakes.forEach(function(snake) {
			changeCoordinate(board, snake.coords, 1);
		});

		/*reqMove.snakes.forEach(function(snake) {
			shortenSnake(board, snake.coords, 0.3);
		});*/

		reqMove.snakes.forEach(function(snake) {
			addHeadProbabilities(board, snake, 0.3);
		});

		return board;
	}

	function getOurSnake(reqMove) {
		var snake = _.where(reqMove.snakes, {id: config.snake.id});
		return snake[0];
	}


	function init(reqStart) {
		size.x = reqStart.width;
		size.y = reqStart.height;
	}

	function predict(reqMove) {
		board = Array(size.y).fill(0).map(row => Array(size.x).fill(0));
		var ourCoords = getOurSnake(reqMove).coords[0]; //The head of our snake
		reqMove.current = {y: ourCoords[1], x: ourCoords[0]};
		reqMove.pmap = convertBoardToMap(reqMove);
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
		"walls": [    // Advanced Only
		    [2, 2]
		],
		"gold": [     // Advanced Only
		    [5, 5]
		]
}
//Testing
// var preprocessor = preprocessor();
// preprocessor.init(sampleReq);
// preprocessor.predict(sampleReq);
//
module.exports = preprocessor;
