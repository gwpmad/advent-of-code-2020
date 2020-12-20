const fs = require('fs');

const rawInstructions = fs.readFileSync(__dirname + '/input', 'utf8');

function calculateManhattanDistance(input) {
  const ferry = ferryStateMachineFactory();
  const instructions = input.match(/[A-Z]|\d+/g);
  
  for (let i = 0; i < instructions.length; i += 2) {
    ferry.followInstruction(instructions[i], instructions[i + 1]);
  }
  return ferry.manhattanDistance;
}

function ferryStateMachineFactory () {
  const EAST = 'E', WEST = 'W', NORTH = 'N', SOUTH = 'S'; LEFT = 'L', RIGHT = 'R', FORWARD = 'F';

  return {
    directionOrder: [EAST, SOUTH, WEST, NORTH],
    xAxis: 0,
    yAxis: 0,
    facing: EAST,

    [WEST]: function(value) { this.xAxis -= value; },
    [EAST]: function(value) { this.xAxis += value; },
    [SOUTH]: function(value) { this.yAxis -= value; },
    [NORTH]: function(value) { this.yAxis += value; },
    [FORWARD]: function(value) { this[this.facing](value) },

    [LEFT]: function(degrees) { this._turnClockwise(360 - degrees) },
    [RIGHT]: function(degrees) { this._turnClockwise(degrees) },
    _turnClockwise (degrees) {
      const quarterCircles = (degrees / 360) * 4;
      const newFacingIdx = (this.directionOrder.indexOf(this.facing) + quarterCircles) % 4;
      this.facing = this.directionOrder[newFacingIdx];
    },

    followInstruction(action, value) { this[action](Number(value)); },
    get manhattanDistance() { return Math.abs(this.xAxis) + Math.abs(this.yAxis); }
  };
}

console.log(calculateManhattanDistance(rawInstructions));