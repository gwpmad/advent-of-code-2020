const fs = require('fs');
const mathsHomework = fs.readFileSync(__dirname + '/input', 'utf8');

function doAdvancedMathsHomework(input) {
  const lines = input.split('\n');
  return lines.reduce((sum, line) =>
    sum + doMathsWithAdditionFirst(lineToArray(line)), 0);
}

function doMathsWithAdditionFirst(statement) {
  for (let i = 0; i < statement.length;) {
    if (Array.isArray(statement[i])) statement[i] = doMathsWithAdditionFirst(statement[i]);

    const element = statement[i], operand = statement[i - 1], previousElement = statement[i - 2];
    if (operand !== '+') {
      i += 2;
      continue;
    }

    statement[i] = previousElement + element;
    statement.splice(i - 2, 2);
  }
  return statement
    .filter(char => char !== '*')
    .reduce((product, number) => product * number);
}

function lineToArray(line) {
  function charToJsonChar(char) {
    if (char === '(') return '[' ;   
    if (char === ')') return '],' ;
    return isNaN(char) ? `"${char}",` : `${char},`;
  }

  const json =  
    ('[' + line.replace(/[0-9]+|\*|\+|\(|\)/g, charToJsonChar) + ']')
      .replace(/,\]/g, ']');
  return JSON.parse(json);
}

console.log(doAdvancedMathsHomework(mathsHomework));
