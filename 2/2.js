const fs = require('fs');

function countValidPasswords(input) {
  const result = input
    .split('\n')
    .reduce((count, entry) => {
      const [policy, password] = entry.split(': ');
      const [positions, letter] = policy.split(' ');
      const zeroIndexedPositions = positions.split('-').map(p => Number(p) - 1);
      const positionsWithLetter = zeroIndexedPositions.filter(idx => password[idx] === letter);
      return positionsWithLetter.length === 1 ? count + 1 : count;
    }, 0);

  return result;
}

const passwordsList = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(countValidPasswords(passwordsList));