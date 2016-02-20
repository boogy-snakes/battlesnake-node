// basic ai, just finds the closest food

module.exports = {
  findClosestFood: function(data) {
    // data
    // {
    //     "game": "hairy-cheese",
    //     "mode": "advanced",
    //     "turn": 0,
    //     "height": 20,
    //     "width": 30,
    //     "snakes": [
    //         <Snake Object>, <Snake Object>, ...
    //     ],
    //     "food": [],
    //     "walls": [],  // Advanced Only
    //     "gold": []    // Advanced Only
          // "pmap": [[][][][]]...
    // }

    // For each food
      // For each snake
        // get the distance to the food
        // Run pathfinding using probability map with cutoff
        // Store

    // Return food we have best chance of getting to first
  }
};
