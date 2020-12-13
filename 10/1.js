const fs = require('fs');

const rawJoltages = fs.readFileSync(__dirname + '/input', 'utf8');

function findJoltageDistribution(input) {
  const joltages = getSortedJoltages(input);
  const jumpCounts = countJumps(joltages);
  return jumpCounts[1] * jumpCounts[3];
}

function getSortedJoltages(input) {
  return input.split('\n')
    .map(Number)
    .sort((a, b) => a - b);
}

function countJumps(joltages) {
  const jumpCounts = { 1: 0, 2: 0, 3: 1 };
  jumpCounts[joltages[0]]++;

  for (let i = 1; i < joltages.length; i++) {
    const jump = joltages[i] - joltages[i - 1];
    jumpCounts[jump]++;
  }

  return jumpCounts;
}

console.log(findJoltageDistribution(rawJoltages));