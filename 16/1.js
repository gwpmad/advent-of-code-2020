const fs = require('fs');

const ticketData = fs.readFileSync(__dirname + '/input', 'utf8');

function calculateErrorRate(input) {
  const [rules, , tickets] = input.split('\n\n');
  const allowedValues = getAllowedValues(rules);
  return getSumOfErrorValues(tickets, allowedValues);
}

function getAllowedValues(rules) {
  const ruleBounds = getNumbers(rules);
  const allowedValues = new Set();
  for (let i = 0; i < ruleBounds.length; i += 2) {
    for (let j = ruleBounds[i]; j <= ruleBounds[i + 1]; j++) {
      allowedValues.add(j);
    }
  }
  return allowedValues;
}

function getSumOfErrorValues(tickets, allowedValues) {
  const values = getNumbers(tickets);
  return values.reduce((sum, value) => {
    if (allowedValues.has(value)) return sum;
    return sum + value;
  }, 0);
}

function getNumbers(string) {
  return string.match(/\d+/g).map(Number);
}

console.log(calculateErrorRate(ticketData));
