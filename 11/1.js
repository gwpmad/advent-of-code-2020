const fs = require('fs');
const seats = fs.readFileSync(__dirname + '/input', 'utf8');

function getInitialSeatState(input) {
  const rows = input.split('\n');
  const state = { graph: {}, occupiedSeats: 0, visitQueue: [], visitedSeats: new Set() };
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const type = row[colIdx] === 'L' ? 'empty' : 'floor';
      state.graph[getSlotName([rowIdx, colIdx])] = {
        type,
        newType: type,
        surroundingSeats: getSurroundingSeats(rowIdx, colIdx, row.length, rows.length),
      };
    }
  }
  return state;
}

function getSlotName([rowIdx, colIdx]) {
  return `${rowIdx}-${colIdx}`;
}

function getSurroundingSeats(rowIdx, colIdx, numberOfColumns, numberOfRows) {
  const rowAbove = rowIdx - 1, rowBelow = rowIdx + 1, leftCol = colIdx - 1, rightCol = colIdx + 1;
  return [
    [rowAbove, leftCol],
    [rowAbove, colIdx],
    [rowAbove, rightCol],
    [rowIdx, leftCol],
    [rowIdx, rightCol],
    [rowBelow, leftCol],
    [rowBelow, colIdx],
    [rowBelow, rightCol],
  ].reduce((seats, [_rowIdx, _colIdx]) => {
      if (_rowIdx < 0 || _rowIdx >= numberOfRows) return seats;
      if (_colIdx < 0 || _colIdx >= numberOfColumns) return seats;
      return seats.concat(getSlotName([_rowIdx, _colIdx]))
    }, []);
  }

function applyRules(seat, seatState) {
  if (seat.type === 'floor') return;
  const adjacentOccupiedSeats = seat.surroundingSeats.filter(
    name => seatState.graph[name].type === 'occupied').length;
  if (seat.type === 'empty' && !adjacentOccupiedSeats) {
    seat.newType = 'occupied';
    seatState.occupiedSeats++;
  }
  if (seat.type === 'occupied' && adjacentOccupiedSeats > 3) {
    seat.newType = 'empty';
    seatState.occupiedSeats--;
  }
}

function traverseSeats(startSeat, seatState) {
  const { visitQueue, visitedSeats, graph } = seatState;
  visitQueue.push(startSeat);
  visitedSeats.add(startSeat);

  while (visitQueue.length) {
    const currentSeat = graph[visitQueue.shift()];
    applyRules(currentSeat, seatState);
    
    for (let seat of currentSeat.surroundingSeats) {
      if (visitedSeats.has(seat)) continue;
      visitQueue.push(seat);
      visitedSeats.add(seat);
    }
  }
}

function prepareSeatState(seatState) {
  for (const seat of Object.values(seatState.graph)) {
    seat.type = seat.newType;
  }
  seatState.visitedSeats.clear();
}

function findNumberOfChangesBeforeStatic(input) {
  const seatState = getInitialSeatState(input);
  let occupiedSeatsBefore = seatState.occupiedSeats;
  do {
    prepareSeatState(seatState)
    occupiedSeatsBefore = seatState.occupiedSeats;
    traverseSeats('0-0', seatState);
  } while (seatState.occupiedSeats !== occupiedSeatsBefore)
  return seatState.occupiedSeats;
}

console.log(findNumberOfChangesBeforeStatic(seats));