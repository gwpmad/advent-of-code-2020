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

function findNextJmpOrNopIdx(array, switchedBefore, changeIdx) {
  let startIdx;
  if (!switchedBefore) {
    startIdx = 0;
  } else {
    startIdx = changeIdx + 2
  }
  
  for (let i = startIdx; i < array.length; i+=2) {
    if (['jmp', 'nop'].includes(array[i])) return i;
  }
  return -1;
}

function switchJmpAndNop(array, switchedBefore, idx) {
  if (!switchedBefore) return;
  array[idx] = array[idx] === 'jmp' ? 'nop' : 'jmp';
}

function fixInfiniteLoopAndCalculateAcc(input) {
  const instructions = input.match(/[a-z]+|((\+|\-)\d+)/g);
  let switchedBefore = false, changeIdx;
  let results = executeInstructionsUpToRepeat(instructions);
  while (results.infinite) {
    switchJmpAndNop(instructions, switchedBefore, changeIdx);
    changeIdx = findNextJmpOrNopIdx(instructions, switchedBefore, changeIdx);

    switchedBefore = true;
    switchJmpAndNop(instructions, switchedBefore, changeIdx);
    results = executeInstructionsUpToRepeat(instructions);
  }
  return results.acc;
}

console.log(fixInfiniteLoopAndCalculateAcc(instructionsString));
