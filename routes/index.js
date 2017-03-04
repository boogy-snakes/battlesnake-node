var config  = require('../config.json');
var express = require('express');
var router  = express.Router();

var pre = require('../src/preprocessor.js');
var ai = require('../src/topAI.js');
var post = require('../src/postprocessor.js');

var map_output = {
  "north": "up",
  "east": "right",
  "west": "left",
  "south": "down"
};


// Handle GET request to '/'
router.get(config.routes.info, function (req, res) {
  // Response data
  var data = {
    "color": "orngered",
    "head_url": config.snake.head_url,
    "head_type": "pixel",
    "tail_type": "pixel"
  };

  return res.json(data);
});

// Handle POST request to '/start'
router.post(config.routes.start, function (req, res) {
  // Do something here to start the game
  var input = req.body;

  // Response data
  var data = {
    taunt: config.snake.taunt.start
  };

  return res.json(data);
});

// Handle POST request to '/move'
router.post(config.routes.move, function (req, res) {
  // Do something here to generate your move

  try{

    var input = req.body;


    console.log('new request:',input);

    var data = pre(input);

    console.log('preprocessed')

    data.cutoff = 0.5 //might be changed by an ai

    data = ai(data);

    console.log('ai run');

    var snake = data.snakes[data.you];
    var tail = snake.coords[snake.coords.length - 1];

    // Response data
    var response = {
      move: map_output[post(data.snakes[data.you].map, data.current, data.target, {x:tail[0], y:tail[1]}, data.cutoff)], // one of: ["north", "east", "south", "west"]
      taunt: config.snake.taunt.move
    };

    console.log("current", data.current);
    console.log(map_output[response.move], data.target);
    //console.dir(data);
  }
  catch(e){
    console.log(e);
    console.log(e.stack);
  }

  return res.json(response);
});

// Handle POST request to '/move'
router.post('//move', function (req, res) {
  // Do something here to generate your move

  try{

    var input = req.body;


    console.log('new request:',input);

    var data = pre(input);

    console.log('preprocessed')

    data.cutoff = 0.5 //might be changed by an ai

    data = ai(data);

    console.log('ai run');

    var snake = data.snakes[data.you];
    var tail = snake.coords[snake.coords.length - 1];

    // Response data
    var response = {
      move: map_output[post(data.snakes[data.you].map, data.current, data.target, {x:tail[0], y:tail[1]}, data.cutoff)], // one of: ["north", "east", "south", "west"]
      taunt: config.snake.taunt.move
    };

    console.log("current", data.current);
    console.log(map_output[response.move], data.target);
    //console.dir(data);
  }
  catch(e){
    console.log(e);
    console.log(e.stack);
  }

  return res.json(response);
});

// Handle POST request to '/end'
router.post(config.routes.end, function (req, res) {
  // Do something here to end your snake's session

  // We don't need a response so just send back a 200
  res.status(200);
  res.end();
  return;
});

module.exports = router;
