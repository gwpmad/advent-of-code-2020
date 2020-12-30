const fs = require('fs');
const mathsHomework = fs.readFileSync(__dirname + '/input', 'utf8');

function processMathsHomework(input) {
  const lines = input.split('\n');
  return lines.reduce((sum, line) =>
    sum + calculateStatement(lineToArray(line)), 0);
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

function calculateStatement(statement) {
  let total = Array.isArray(statement[0]) ? calculateStatement(statement[0]) : statement[0];
  for (let i = 2; i < statement.length; i += 2) {
    let element = statement[i], operand = statement[i - 1];
    if (Array.isArray(element)) element = calculateStatement(element);
    total = operand === '+' ? total + element : total * element;
  }
  return total;
}

console.log(processMathsHomework(mathsHomework));
