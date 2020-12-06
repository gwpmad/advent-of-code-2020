const fs = require('fs');

function countTrees(input) {
  let treeCount = 0;
  const inputArray = input.split('\n');
  const lineLastIdx = inputArray[0].length - 1;
  for (let i = 0, j = 0; i < inputArray.length; i++, j+=3) {
    if (j > lineLastIdx) j = (j % lineLastIdx) - 1;
    if (inputArray[i][j] === '#') treeCount++;
  }
  return treeCount;
}

const terrain = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(countTrees(terrain));