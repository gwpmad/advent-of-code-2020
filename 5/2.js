const fs = require('fs');

function getSortedSeatNumbers(input) {
  return input
    .replace(/F|L|B|R/g, char => char === 'F' || char === 'L' ? '0' : '1')
    .split('\n')
    .map(binary => parseInt(binary, 2))
    .sort((a, b) => a - b)
}

function findMissingSeatId(input) {
  const seatNumbers = getSortedSeatNumbers(input);
  const initialDifference = seatNumbers[0];

  let start = 0, end = seatNumbers.length - 1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const seatNumber = seatNumbers[mid];
    if (seatNumbers[mid + 1] - seatNumber > 1) return seatNumber + 1;
    if (seatNumber - mid > initialDifference) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
}

const boardingPasses = fs.readFileSync(__dirname + '/input', 'utf8');

console.log(findMissingSeatId(boardingPasses))
