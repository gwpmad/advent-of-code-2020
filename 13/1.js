const fs = require('fs');

const busInfo = fs.readFileSync(__dirname + '/input', 'utf8');

function calculateEarliestBusTimesRemainder(input) {
  const splitInput = input.split('\n');
  const availableTime = Number(splitInput[0]);
  const buses = splitInput[1].match(/\d+/g);

  let lowestRemainder;
  let winningBus;
  for (let i = 0; i < buses.length; i++) {
    const bus = Number(buses[i]);
    const maxDivisor = Math.ceil(availableTime / bus);
    const remainder = (maxDivisor * bus) - availableTime; 

    if (!lowestRemainder) lowestRemainder = remainder;
    if (remainder > lowestRemainder) continue;

    lowestRemainder = remainder;
    winningBus = bus;
  }
  return lowestRemainder * winningBus;
}

console.log(calculateEarliestBusTimesRemainder(busInfo));
