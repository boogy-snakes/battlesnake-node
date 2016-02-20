function addN(dir, prev, curr) {
  var inity = prev[0];
  var initx = prev[1];
  var coordList = Array(Math.abs(prev[dir]-curr[dir]) + 1).fill(0);
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


reqMove.snakes.forEach(function(snake){
  console.log('Have snake' + snake)
  //put snake on board by looking at coords
  snake.coords.forEach(function(curr, index, array){
    if(index === 0) return;
    var prev = array[index - 1];
    console.log('prev : (' + prev + ')');
    var coordList = generateCoordinateList(prev, curr);
    console.log(coordList);
    changeCoordinate(board, coordList, 1);
    console.log(board);
  });
});
