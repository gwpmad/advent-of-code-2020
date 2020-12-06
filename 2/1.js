const fs = require('fs');

function countValidPasswords(input) {
  const result = input
    .split('\n')
    .reduce((count, entry) => {
      const [policy, password] = entry.split(': ');
      const [bounds, letter] = policy.split(' ');
      const [min, max] = bounds.split('-').map(Number);
      const letterOccurrences = password.split('').filter(char => char === letter).length;
      const valid = letterOccurrences >= min && letterOccurrences <= max;
      return valid ? count + 1 : count;
    }, 0);

  return result;
}

const passwordsList = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(countValidPasswords(passwordsList));