const fs = require('fs');

const rawInstructions = fs.readFileSync(__dirname + '/input', 'utf8');

function calculateManhattanDistance(input) {
  const ferry = ferryFactory();
  const instructions = input.match(/[A-Z]|\d+/g);
  
  for (let i = 0; i < instructions.length; i += 2) {
    ferry.followInstruction(instructions[i], Number(instructions[i + 1]));
  }
  return ferry.manhattanDistance;
}

function ferryFactory () {
  const EAST = 'E', WEST = 'W', NORTH = 'N', SOUTH = 'S'; LEFT = 'L', RIGHT = 'R', FORWARD = 'F';

  return {
    location: { x: 0, y: 0 },
    waypoint: { x: 10, y: 1 },

    [WEST]: function(value) { this.waypoint.x -= value; },
    [EAST]: function(value) { this.waypoint.x += value; },
    [SOUTH]: function(value) { this.waypoint.y -= value; },
    [NORTH]: function(value) { this.waypoint.y += value; },
    [FORWARD]: function(value) {
      this.location.x += (this.waypoint.x * value);
      this.location.y += (this.waypoint.y * value);
    },

    [LEFT]: function(degrees) { this._rotateWaypointClockwise(360 - degrees) },
    [RIGHT]: function(degrees) { this._rotateWaypointClockwise(degrees) },
    _rotateWaypointClockwise (degrees) {
      const quarterCircles = (degrees / 360) *  4;
      for (let i = 0; i < quarterCircles; i++) {
        const initialX = this.waypoint.x;
        this.waypoint.x = this.waypoint.y;
        this.waypoint.y = initialX * -1;
      }
    },

    followInstruction(action, value) { this[action](value); },
    get manhattanDistance() { return Math.abs(this.location.x) + Math.abs(this.location.y); }
  };
}

console.log(calculateManhattanDistance(rawInstructions));