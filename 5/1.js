const fs = require('fs');

function calculateSeatId(boardingPass) {
  let minRow = 0, maxRow = 127;
  let minCol = 0; maxCol = 7;
  
  for (let i = 0; i < boardingPass.length; i++) {
    const halfRowRange = (((maxRow + 1) - minRow) / 2);
    const halfColRange = (((maxCol + 1) - minCol) / 2);
    switch(boardingPass[i]) {
      case 'F':
        maxRow -= halfRowRange;
        break;
      case 'B':
        minRow += halfRowRange;
        break;
      case 'L':
        maxCol -= halfColRange;
        break;
      case 'R':
        minCol += halfColRange;
        break;
      }
  }
  return (minRow * 8) + minCol;
}

function getHighestSeatId(input) {
  return input.split('\n')
    .reduce((highest, boardingPass) => {
      const seatId = calculateSeatId(boardingPass);
      return seatId > highest ? seatId : highest;
    }, 0);
}

const boardingPasses = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(getHighestSeatId(boardingPasses))

function cleverSolution(input) {
  return input
    .replace(/F|L|B|R/g, char => char === 'F' || char === 'L' ? '0' : '1')
    .split('\n')
    .reduce((highest, binary) => {
      const seatId = parseInt(binary, 2)
      return seatId > highest ? seatId : highest;
    }, 0)
}

console.log(cleverSolution(boardingPasses))
