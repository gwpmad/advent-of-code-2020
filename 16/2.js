const fs = require('fs');

const ticketData = fs.readFileSync(__dirname + '/input', 'utf8');

function getIndicesOfTicketFields(rules, tickets) {
  const { allPossibleValues, fieldRanges } = getRules(rules);
  const prunedTickets = pruneTickets(tickets, allPossibleValues);
  const possibleFieldIndices = getPossibleFieldIndices(fieldRanges, prunedTickets);
  const finalisedFieldIndices = ensureOnlyOneIndexPerField(possibleFieldIndices);
  return mapToLookup(finalisedFieldIndices);
}

function getRules(rules) {
  return rules
    .split('\n')
    .reduce((result, line) => {
      const [name, bounds] = line.split(':');
      const boundNumbers = getNumbers(bounds);
      result.fieldRanges.set(name, new Set());
      for (let i = 0; i < boundNumbers.length; i += 2) {
        for (let j = boundNumbers[i]; j <= boundNumbers[i + 1]; j++) {
          result.allPossibleValues.add(j);
          result.fieldRanges.get(name).add(j);
        }
      }
      return result;
    },{ allPossibleValues: new Set(), fieldRanges: new Map() });
}

function pruneTickets(tickets, allPossibleValues) {
  const splitTickets = tickets.split('\n');
  const prunedTickets = [];
  for (let i = 1; i < splitTickets.length; i++) {
    const numericTicket = getNumbers(splitTickets[i]);
    const valid = numericTicket.every(n => allPossibleValues.has(n));
    if (valid) prunedTickets.push(numericTicket);
  }
  return prunedTickets;
}

function getPossibleFieldIndices(fieldRanges, tickets) {
  const fieldIndices = new Map([...fieldRanges.keys()].map(key => {
    const indicesRange = new Set(Array(tickets[0].length).keys());
    return [key, indicesRange];
  }));

  for (let [field, indices] of fieldIndices) {
    const range = fieldRanges.get(field);
    for (let idx of indices) {
      for (let i = 0; i , i < tickets.length; i++) {
        if (range.has(tickets[i][idx])) continue;
        indices.delete(idx);
        break;
      }
    }
  }
  return fieldIndices;
}

function ensureOnlyOneIndexPerField(fieldIndices) {
  let finished = false;
  while (!finished) {
    finished = true;
    for (let [field, indices] of fieldIndices) {
      if (indices.size !== 1) {
        finished = false;
        continue;
      }
      const idx = indices.values().next().value;
      for (let [_field, _indices] of fieldIndices) {
        if (_field !== field) _indices.delete(idx);
      }
    }
  }
  return fieldIndices;
}

function mapToLookup(fieldIndices) {
  const lookup = {};
  for (let [field, indices] of fieldIndices) {
    const idx = indices.values().next().value;
    lookup[field] = idx;
  }
  return lookup;
}

function getNumbers(string) {
  return string.match(/\d+/g).map(Number);
}

const [rules, yourTicket, tickets] = ticketData.split('\n\n');
const fieldIndices = getIndicesOfTicketFields(rules, tickets);
const yourTicketNumeric = getNumbers(yourTicket);
const answer = Object.keys(fieldIndices)
  .filter(field => field.startsWith('departure'))
  .reduce((product, field) => product * yourTicketNumeric[fieldIndices[field]], 1);
console.log(answer);
