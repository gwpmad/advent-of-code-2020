const fs = require('fs');

const rawNumbers = fs.readFileSync(__dirname + '/input', 'utf8');
const PREAMBLE_SIZE = 25;

function getFirstNumberThatIsNotSum(input) {
  const numbers = input.split('\n').map(Number);
  const preamble = new Set(numbers.slice(0, PREAMBLE_SIZE));

  for (let i = PREAMBLE_SIZE; i < numbers.length; i++) {
    const number = numbers[i];
    const { winner, preambleFirstValue } = checkPreamble(preamble, number);
    if (winner) return number;
    preamble.delete(preambleFirstValue);
    preamble.add(number);
  }
}

function checkPreamble(preamble, number) {
  const results = {};
  const iterator = preamble.values();
  let next = iterator.next();
  results.preambleFirstValue = next.value;

  while (!next.done) {
    const remainder = number - next.value;
    if (preamble.has(remainder) && (remainder !== next.value)) break;
    next = iterator.next();
  }

  if (next.done) results.winner = true;
  return results;
}

console.log(getFirstNumberThatIsNotSum(rawNumbers));
