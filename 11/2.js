const fs = require('fs');

const seatingPlan = fs.readFileSync(__dirname + '/input', 'utf8');
const FLOOR = '.', OCCUPIED = '#', VACANT = 'L';

function countChairsAfterChanges(input) {
  let chairs = input.split('\n').map(l => l.split(''));
  const newChairs = cloneChairs(chairs);
  let occupiedChairsBefore = 0, occupiedChairs = 0;
  const incrementOccupiedChairs = increment => occupiedChairs += increment;

  do {
    occupiedChairsBefore = occupiedChairs;
    musicalChairs(chairs, newChairs, incrementOccupiedChairs);
    chairs = cloneChairs(newChairs);
  } while (occupiedChairs !== occupiedChairsBefore)
  return occupiedChairs;
}

function musicalChairs(chairs, newChairs, incrementOccupiedChairs) {
  for (let i = 0; i < chairs.length; i++) {
    for (let j = 0; j < chairs[i].length; j++) {
      applyChairRules([i, j], chairs, newChairs, incrementOccupiedChairs);
    }
  }
}

function applyChairRules(coords, chairs, newChairs, incrementOccupiedChairs) {
  const [coord1, coord2] = coords;
  const chair = chairs[coord1][coord2];
  if (chair === FLOOR) return;

  const visibleOccupiedChairs = getVisibleOccupiedChairs(coords, chairs);
  if (chair === VACANT && !visibleOccupiedChairs) {
    newChairs[coord1][coord2] = OCCUPIED;
    incrementOccupiedChairs(1);
  }
  if (chair === OCCUPIED && visibleOccupiedChairs > 4) {
    newChairs[coord1][coord2] = VACANT;
    incrementOccupiedChairs(-1);
  }
}

function getVisibleOccupiedChairs(coords, chairs) {
  let visibleOccupiedChairs = 0;
  const increments = [-1, 0, 1];
  increments.forEach((verticalIncrement) => {
    increments.forEach((horizontalIncrement) => {
      if (verticalIncrement === 0 && horizontalIncrement === 0) return;
      
      for (
        let i = coords[0] + verticalIncrement, j = coords[1] + horizontalIncrement;
        i < chairs.length && i > -1 && j < chairs[0].length && j > -1;
        i += verticalIncrement, j += horizontalIncrement
      ) {
        const chair = chairs[i][j];
        if (chair === FLOOR) continue;
        if (chair === OCCUPIED) visibleOccupiedChairs++;
        break;
      }
    });
  });
  return visibleOccupiedChairs;
}

function cloneChairs(chairs) {
  return JSON.parse(JSON.stringify(chairs));
}

console.log(countChairsAfterChanges(seatingPlan));
