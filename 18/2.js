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
    
    const operand = statement[i], operator = statement[i - 1], previousOperand = statement[i - 2];
    if (operator !== '+') {
      i += 2;
      continue;
    }
    
    statement[i] = previousOperand + operand;
    statement.splice(i - 2, 2);
  }
  return statement
    .reduce((product, number) => {
      if (number === '*') return product;
      return product * number;
    });
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
