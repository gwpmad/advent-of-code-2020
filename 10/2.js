// Example of dynamic programming

const fs = require('fs');
const rawJoltages = fs.readFileSync(__dirname + '/input', 'utf8');

function countAdaptorPaths(input) {
  const sortedJoltages = getSortedJoltages(input);
  const slices = getSlicesThatHavePermutations(sortedJoltages)
  const pathCount = slices.reduce((total, slice) => {
    if (slice.length === 1) return total;
    return total * countPathsForSlice(slice)
  }, 1);
  return pathCount;
}

function getSortedJoltages(input) {
  return input.split('\n')
    .map(Number)
    .sort((a, b) => a - b);
}

function getSlicesThatHavePermutations(joltages) {
  const slices = [[0]];
  for (let i = 0; i < joltages.length; i++) {
    let lastSlice = slices[slices.length - 1];
    const previous = lastSlice[lastSlice.length - 1];
    if (joltages[i] - previous === 3) {
      lastSlice = []
      slices.push(lastSlice);
    }
    lastSlice.push(joltages[i]);
  }
  return slices;
}

function countPathsForSlice(slice) {
  const graph = getAdaptorGraph(slice);
  let count = 0;
  const increment = () => count++;
  countPathsUsingDfs(graph, increment, slice[0]);
  return count;
}

function getAdaptorGraph(joltages) {
  return joltages
    .reduce((graph, joltage, idx) => {
      graph.set(joltage, new Set());
      for (let i = idx + 1; i <= idx + 3; i++) {
        const higherJoltage = joltages[i];
        if ((higherJoltage - joltage) <= 3) {
          graph.get(joltage).add(higherJoltage)
        } else {
          break;
        }
      }
      return graph;
    }, new Map());
}

function countPathsUsingDfs(graph, increment, number) {
  for (const neighbour of graph.get(number)) {
    if (graph.get(neighbour).size) {
      countPathsUsingDfs(graph, increment, neighbour);
    } else {
      increment();
    }
  }
}

console.log(countAdaptorPaths(rawJoltages));
