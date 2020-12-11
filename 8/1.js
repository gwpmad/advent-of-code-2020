const fs = require('fs');
const instructionsString = fs.readFileSync(__dirname + '/input', 'utf8');

function readInstructionsUpToRepeat(input) {
  const instructions = input.match(/[a-z]+|((\+|\-)\d+)/g);
  const executedInstructions = new Set();
  let i = 0, acc = 0;

  while (!executedInstructions.has(i)) {
    if (executedInstructions.has(i)) break;
    executedInstructions.add(i);

    const op = instructions[i], number = Number(instructions[i+1]);
    if (op === 'acc') acc+=number;
    if (op === 'jmp') {
      i+=(number * 2);
      continue;
    }
    i+=2;
  }

  return acc;
}

console.log(readInstructionsUpToRepeat(instructionsString));