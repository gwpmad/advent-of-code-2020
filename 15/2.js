/*
  Explanation of why Map is SO MUCH FASTER than Object for this sort of work (this is too slow to use with Object but takes 5-10
  seconds only with Map): https://stackoverflow.com/questions/18541940/map-vs-object-in-javascript/49164774#49164774

  - An object behaves like a dictionary because Javascript is dynamically typed, allowing you to add or remove properties at any time.
  - Using an object as a dictionary with lots of additions and deletions is very slow, but reads of existing keys without changing the object are very fast.
  - When making additions and deletions like below use Map because they don't cause re-compiling of a C++ class
  - Also Maps allow numeric (or anything else) keys, which is what we're doing below
  - You should always use Maps for lookups basically - objects aren't really for that
*/

function findNthNumberSpoken(firstNumbers, n) {
  const memory = new Map(firstNumbers.map((number, idx) => [number, [idx]]));
  let previousNumber, previousNumberOccurrences = memory.get(firstNumbers[firstNumbers.length - 1]);

  for (let i = firstNumbers.length; i < n; i++) {
    previousNumber = 0;
    if (previousNumberOccurrences.length > 1) {
      const [secondLastOccurrence, lastOccurence] = previousNumberOccurrences.slice(-2);
      previousNumber = lastOccurence - secondLastOccurrence;
    }
    
    previousNumberOccurrences = memory.get(previousNumber);
    if (!previousNumberOccurrences) {
      previousNumberOccurrences = [];
      memory.set(previousNumber, previousNumberOccurrences);
    }
    previousNumberOccurrences.push(i);
  }
  return previousNumber;
}

console.log(findNthNumberSpoken([6, 4, 12, 1, 20, 0, 16], 30000000));
