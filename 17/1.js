const fs = require('fs');
const grid = fs.readFileSync(__dirname + '/input', 'utf8');

const ACTIVE = '#';

function getActiveCubesAfterCycles(input, numberOfCycles) {
  let activeCubes = getInitialState(input);
  for (let i = 0; i < numberOfCycles; i++) {
    activeCubes = executeCycle(activeCubes);
  }
  return activeCubes.size;
}

function executeCycle(activeCubes) {
  const newActiveCubes = new Set();
  const iterator = getCubesToScan(activeCubes).values();
  let next = iterator.next();
  while (!next.done) {
    const cube = next.value;
    const activeCubesNearby = getCubesNearby(cube)
      .reduce((sum, nearbyCube) => activeCubes.has(nearbyCube) ? sum + 1 : sum, 0);
    if (activeCubes.has(cube)) {
      if (activeCubesNearby === 2 || activeCubesNearby === 3) newActiveCubes.add(cube);
    } else {
      if (activeCubesNearby === 3) newActiveCubes.add(cube);
    }
    next = iterator.next();
  }
  return newActiveCubes;
}

function getCubesToScan(activeCubes) {
  const cubesToScan = new Set();
  activeCubes.forEach(cube => {
    const cubesNearby = getCubesNearby(cube);
    cubesNearby.forEach(cube => cubesToScan.add(cube));
  });
  return cubesToScan;
}


function getCubesNearby(cube) {
  const axes = cube.split(',').map(Number);
  const cubesNearby = [];
  for (let x = axes[0] - 1; x <= axes[0] + 1; x++) {
    for (let y = axes[1] - 1; y <= axes[1] + 1; y++) {
      for (let z = axes[2] - 1; z <= axes[2] + 1; z++) {
        const cubeName = getCubeName(x, y, z);
        if (cubeName !== cube) cubesNearby.push(cubeName);
      }
    }
  }
  return cubesNearby;
}

function getInitialState(input) {
  const rows = input.split('\n');
  const yOffset = rows.length - 1;
  const z = 0;
  return input.split('\n')
    .reduceRight((state, row, idx) => {
      const y = yOffset - idx;
      row.split('').forEach((square, x) => {
        if (square === ACTIVE) state.add(getCubeName(x, y, z));
      });
      return state
    }, new Set());
}

function getCubeName(x, y, z) {
  return `${x},${y},${z}`;
}

console.log(getActiveCubesAfterCycles(grid, 6));
