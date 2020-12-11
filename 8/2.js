const fs = require('fs');
const instructionsString = fs.readFileSync(__dirname + '/input', 'utf8');

function executeInstructionsUpToRepeat(instructions) {
  const executedInstructions = new Set();
  const results = { infinite: false, acc: 0 };
  
  for (let i = 0; i < instructions.length;) {
    if (executedInstructions.has(i)) {
      results.infinite = true;
      break;
    }
    executedInstructions.add(i);

    const op = instructions[i], number = Number(instructions[i+1]);
    if (op === 'acc') results.acc+=number;
    if (op === 'jmp') {
      i+=(number * 2);
      continue;
    }
    i+=2;
  }

  return results;
}

function findNextJmpOrNopIdx(array, startIdx) {
  for (let i = startIdx; i < array.length; i+=2) {
    if (['jmp', 'nop'].includes(array[i])) return i;
  }
  return -1;
}

function switchJmpAndNop(array, idx) {
  array[idx] = array[idx] === 'jmp' ? 'nop' : 'jmp';
}

function fixInfiniteLoopAndCalculateAcc(input) {
  const instructions = input.match(/[a-z]+|((\+|\-)\d+)/g);
  let changeIdx = -2;
  let results = executeInstructionsUpToRepeat(instructions);
  while (results.infinite) {
    if (changeIdx > -2) switchJmpAndNop(instructions, changeIdx);
    changeIdx = findNextJmpOrNopIdx(instructions, changeIdx + 2);
    switchJmpAndNop(instructions, changeIdx);
    results = executeInstructionsUpToRepeat(instructions);
  }
  return results.acc;
}

console.log(fixInfiniteLoopAndCalculateAcc(instructionsString));
