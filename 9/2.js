const fs = require('fs');

const rawNumbers = fs.readFileSync(__dirname + '/input', 'utf8');
const INVALID_NUMBER = 1038347917;

function findEncryptionWeakness(input, total) {
  const numbers = input.split('\n').map(Number);
  const { minIdx, maxIdx } = getSliceBoundsOfWeakness(numbers, total);
  const sortedWeakness = numbers.slice(minIdx, maxIdx).sort((a, b) => a - b);
  return sortedWeakness[0] + sortedWeakness[sortedWeakness.length - 1];
}

function getSliceBoundsOfWeakness(numbers, total) {
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1, acc = numbers[i]; j < numbers.length, acc < total; j++) {
      acc += numbers[j];
      if (acc === total) return { minIdx: i, maxIdx: j + 1 };
    }
  }
}

console.log(findEncryptionWeakness(rawNumbers, INVALID_NUMBER));
