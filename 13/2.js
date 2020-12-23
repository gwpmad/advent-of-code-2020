const fs = require('fs');

const busInfo = fs.readFileSync(__dirname + '/input', 'utf8');

function getEarliestTimestampWithConsecutiveBusMinutes(input) {
  const buses = getBusInfo(input);
  let startTime = buses.times[0];
  let increment;
  let winner;

  while (!winner) {
    const result = timeRequirementsMet(buses, startTime);
    ({ winner } = result);
    increment = getLeastCommonMultiple(buses.times.slice(0, result.failingIdx));
    startTime += increment
  }
  return winner;
}

function getBusInfo(input) {
  return input
    .split('\n')[1]
    .split(',')
    .reduce((acc, bus, idx) => {
      if (bus === 'x') return acc;
      acc.times.push(BigInt(bus));
      acc.offsets.push(BigInt(idx));
      return acc;
    }, { times: [], offsets: [] });
}

function timeRequirementsMet({ times, offsets }, startTime) {
  for (let i = 0; i < times.length; i++) {
    const testTime = startTime + offsets[i];
    if (testTime % times[i] === BigInt(0)) continue;
    return { failingIdx: i };
  }
  return { winner: startTime };
}

function getLeastCommonMultiple(arr) {
  let leastCommonMultiple = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    const divisor = getGreatestCommonDivisor(leastCommonMultiple, arr[i]);
    leastCommonMultiple = (leastCommonMultiple * arr[i]) / divisor;
  }
  return leastCommonMultiple;
}

function getGreatestCommonDivisor(x, y) {
  let [greater, lesser] = x > y ? [x, y] : [y, x];
  
  while (lesser) {
    const tempLesser = lesser;
    lesser = greater % lesser;
    greater = tempLesser;
  }
  return BigInt(greater);
}

console.log(getEarliestTimestampWithConsecutiveBusMinutes(busInfo));
