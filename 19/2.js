const fs = require('fs');
const rulesAndMessages = fs.readFileSync(__dirname + '/input', 'utf8');

const depth = 10;

function countMessagesFollowingRule(input, ruleNumber) {
  const [rules, messages] = input.split('\n\n');
  const unparsedRules = scanRulesStringForPart2(rules);
  const regexes = getRulesRegexes(unparsedRules);
  const ruleRegex = new RegExp(`^${regexes.get(ruleNumber)}$`);
  return messages
    .split('\n')
    .reduce((count, message) => message.match(ruleRegex) ? count + 1 : count, 0);
}

function scanRulesStringForPart2(rules) {
  const rawRules = rules.match(/(\d+(?=\:))|((?<=: )(.*)(?=\n|$))/g);
  const unparsedRules = new Set();
  for (let i = 0; i < rawRules.length; i+=2) {
    const ruleNumber = rawRules[i]
    let rule = rawRules[i + 1];
    if (ruleNumber === '8') {
      rule = '42 | 42 8';
    } else if (ruleNumber === '11') {
      rule = '42 31 | 42 11 31';
    }
    unparsedRules.add([ruleNumber, rule]);
  }
  return unparsedRules;
}

function getRulesRegexes(unparsedRules) {
  const regexes = new Map();

  while (unparsedRules.size) {
    for (let unparsedRule of unparsedRules) {
      const [ruleNumber, rule] = unparsedRule;

      let parsedRule;
      if (rule.startsWith('"')) {
        parsedRule = rule.slice(1, rule.length - 1);
      } else {
        const tokens = rule.split(' ');
        const selfReferencingRule = tokens.some(token => token === ruleNumber);
        if (selfReferencingRule) {
          const moreScanningNeededForSelfRefRule = 
            tokens.slice(0, tokens.indexOf('|')).some(token => token !== '|' && !regexes.has(token));
          if (moreScanningNeededForSelfRefRule) continue;
        } else if (tokens.some(token => token !== '|' && !regexes.has(token))) {
          continue;
        }

        parsedRule = tokens.reduce((string, token) => {
          if (token === '|') return string.concat(')|(');
          if (token === ruleNumber) {
            const addition = tokens.slice(0, tokens.indexOf('|')).map(earlierToken => regexes.get(earlierToken)).join('');
            return string.concat(`(${addition}){1,${depth}}`);
          };
          return string.concat(regexes.get(token));
        }, '');
      }
      regexes.set(ruleNumber, `((${parsedRule}))`);
      unparsedRules.delete(unparsedRule);
    }
  }
  return regexes;
}

console.log(countMessagesFollowingRule(rulesAndMessages, '0'));
