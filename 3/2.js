const fs = require('fs');

function checkMultipleSlopes(input, slopes) {
  const inputArray = input.split('\n');
  const lineLastIdx = inputArray[0].length - 1;

  function countTrees([right, down]) {
    let treeCount = 0;
    for (let i = 0, j = 0; i < inputArray.length; i+=down, j+=right) {
      if (j > lineLastIdx) j = (j % lineLastIdx) - 1;
      if (inputArray[i][j] === '#') treeCount++;
    }
    return treeCount;
  }

  return slopes.reduce((product, slope) => product * countTrees(slope), 1);
}

const terrain = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(checkMultipleSlopes(terrain, [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]));
