const fs = require('fs');

const rawNumbers = fs.readFileSync(__dirname + '/input', 'utf8');
const PREAMBLE_SIZE = 25;

function getFirstNumberThatIsNotSum(input) {
  const numbers = input.split('\n').map(Number);
  const preamble = new Set(numbers.slice(0, PREAMBLE_SIZE));

  for (let i = PREAMBLE_SIZE; i < numbers.length; i++) {
    const { winner, preambleFirstValue } = checkPreamble(preamble, numbers[i]);
    if (winner) return numbers[i];
    preamble.delete(preambleFirstValue);
    preamble.add(numbers[i]);
  }
}

function checkPreamble(preamble, number) {
  const results = { winner: false };
  const iterator = preamble.values();
  let next = iterator.next(), remainder;
  results.preambleFirstValue = next.value;

  do {
    remainder = number - next.value;
    next = iterator.next();
  } while (!preamble.has(remainder) && !next.done);

  if (next.done) results.winner = true;
  return results;
}

console.log(getFirstNumberThatIsNotSum(rawNumbers));
