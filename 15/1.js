const assert = require('assert');

function findNthNumberSpoken(firstNumbers, n) {
  const memory = {};
  let previousNumber, previousNumberOccurrences;
  for (let i = 0; i < firstNumbers.length; i++) {
    previousNumber = firstNumbers[i];
    previousNumberOccurrences = memory[previousNumber] = [i]; 
  }
  
  for (let i = firstNumbers.length; i < n; i++) {
    previousNumber = 0;
    if (previousNumberOccurrences.length > 1) {
      const [secondLastOccurrence, lastOccurence] = previousNumberOccurrences.slice(-2);
      previousNumber = lastOccurence - secondLastOccurrence;
    }
    
    previousNumberOccurrences = memory[previousNumber] = memory[previousNumber] || [];
    previousNumberOccurrences.push(i);
  }
  return previousNumber;
}

assert.equal(findNthNumberSpoken([0, 3, 6], 3), 6);
assert.equal(findNthNumberSpoken([0, 3, 6], 2020), 436);
assert.equal(findNthNumberSpoken([2, 1, 3], 2020), 10);
assert.equal(findNthNumberSpoken([1, 2, 3], 2020), 27);
assert.equal(findNthNumberSpoken([2, 3, 1], 2020), 78);
assert.equal(findNthNumberSpoken([3, 2, 1], 2020), 438);
assert.equal(findNthNumberSpoken([3, 1, 2], 2020), 1836);
assert.equal(findNthNumberSpoken([6, 4, 12, 1, 20, 0, 16], 2020), 475);
