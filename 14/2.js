const fs = require('fs');

const initialisationProgram = fs.readFileSync(__dirname + '/input', 'utf8');

const NUMBER_OF_BITS = 36;
const FLOATING_BIT = 'X';

function storeAndSumValuesInMemory(input) {
  const instructions = input.split('\n');
  const memory = {};
  let mask, binaryPermutations;
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    if (instruction.startsWith('mem')) {
      saveValuesToMaskedAddresses(memory, instruction, mask, binaryPermutations);
      continue;
    }
    mask = instruction.slice(NUMBER_OF_BITS * -1);
    binaryPermutations = getFloatingBitPermutations(mask);
  }
  return getSumOfValues(memory);
}

function getFloatingBitPermutations(mask) {
  const length = mask.split('').filter(bit => bit === FLOATING_BIT).length;
  const permutations = [];
  const maxDecimal = parseInt('1'.repeat(length), 2);
  
  for (let i = 0; i <= maxDecimal; i++) {
    const binary = i.toString(2);
    permutations.push(binary.padStart(length, '0'));
  }
  return permutations;
}

function saveValuesToMaskedAddresses(memory, instruction, mask, binaryPermutations) {
  const [address, value] = instruction.match(/\d+/g).map(Number);
  const bitValue = get36BitValue(address);
  binaryPermutations.forEach(permutation => {
    const addressPermutation = getMaskedAddressPermutation(bitValue, mask, permutation);
    memory[addressPermutation] = value;
  });
}

function get36BitValue(int) {
  return int.toString(2).padStart(NUMBER_OF_BITS, '0');
}

function getMaskedAddressPermutation(bitValue, mask, binaryPermutation) {
  let maskedPermutation = '';
  for (let i = 0, floatingBitIdx = 0; i < NUMBER_OF_BITS; i++) {
    let bit = bitValue[i];
    if (mask[i] === '1') bit = '1';
    if (mask[i] === FLOATING_BIT) {
      bit = binaryPermutation[floatingBitIdx];
      floatingBitIdx++
    }
    maskedPermutation += bit;
  }
  return parseInt(maskedPermutation, 2);
}

function getSumOfValues(memory) {
  return Object.values(memory).reduce((sum, value) => sum + value);
}

console.log(storeAndSumValuesInMemory(initialisationProgram));
