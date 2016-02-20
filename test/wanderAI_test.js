var wander = require('../src/wanderAI');

var data = {
  "game": "hairy-cheese",
  "mode": "advanced",
  "height": 6,
  "width": 9,
  "snakes": [{
      "id": "b475914e-61a4-45bf-bfd9-a31486e398d0",
      "coords": [ [0, 0], [1, 2], [2, 2] ],
    },{
      "id": "22",
      "coords": [ [3, 4], [3, 5], [4, 5] ],
    },{
      "id": "33",
      "coords": [ [1, 3], [2, 3], [2, 4] ],
    },{
      "id": "44",
      "coords": [ [4, 5], [4, 6], [3, 6] ],
  }],
  "food": [
      [1, 2], [3, 3], [1,4], [4,4]
  ],
  "current": {x: 0, y: 0},
  "pmap": [
    [0,0,0,1,0,.4,.5,0,1],
    [0,0,1,1,0,1,.5,0,1],
    [0,1,0,0,0,0,.1,0,1],
    [0,0,0,1,0,1,.5,0,1],
    [.2,0,0,1,0,.5,.5,0,1],
    [.2,0,0,1,0,.5,.5,0,1],
    [.2,0,0,1,0,.5,.5,0,1]
  ]
};

var res = wander(data);
console.log(res.target);
