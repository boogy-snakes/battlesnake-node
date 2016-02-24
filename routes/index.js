var config  = require('../config.json');
var express = require('express');
var router  = express.Router();

var pre = require('../src/preprocessor.js');
var ai = require('../src/topAI.js');
var post = require('../src/postprocessor.js');

// Handle GET request to '/'
router.get(config.routes.info, function (req, res) {
  // Response data
  var data = {
    color: config.snake.color,
    head_url: config.snake.head_url,
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

    console.log('new request');

    var data = pre(input);

    console.log('preprocessed')

    data = ai(data);

    console.log('ai run');

    data.cutoff = 0.5

    // Response data
    var response = {
      move: post(data.snakes[config.snake.id].map, data.current, data.target, data.cutoff), // one of: ["north", "east", "south", "west"]
      taunt: config.snake.taunt.move
    };

    console.log("current", data.current);
    console.log(response.move, data.target);
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
