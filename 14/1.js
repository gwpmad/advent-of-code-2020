const fs = require('fs');

const initialisationProgram = fs.readFileSync(__dirname + '/input', 'utf8');

const NUMBER_OF_BITS = 36;

function storeAndSumValuesInMemory(input) {
  const instructions = input.split('\n');
  const memory = {};
  let mask;
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    if (instruction.startsWith('mask')) {
      mask = instruction.slice(NUMBER_OF_BITS * -1);
      continue;
    }
    storeValueInMemory(instruction, mask, memory);
  }
  return getSumOfValues(memory);
}

function storeValueInMemory(instruction, mask, memory) {
  const [address, value] = instruction.match(/\d+/g);
  memory[address] = calculateMaskedValue(Number(value), mask);
}

function calculateMaskedValue(int, mask) {
  const bitValue = get36BitValue(int);
  let maskedValue = '';
  for (let i = 0; i < NUMBER_OF_BITS; i++) {
    maskedValue += mask[i] === 'X' ? bitValue[i] : mask[i];
  }
  return parseInt(maskedValue, 2);
}

function get36BitValue(int) {
  const bitValue = int.toString(2);
  return '0'.repeat(NUMBER_OF_BITS - bitValue.length).concat(bitValue);
}

function getSumOfValues(memory) {
  return Object.values(memory).reduce((sum, value) => sum + value);
}

console.log(storeAndSumValuesInMemory(initialisationProgram));
