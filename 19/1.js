const fs = require('fs');
const rulesAndMessages = fs.readFileSync(__dirname + '/input', 'utf8');

function countMessagesFollowingRule(input, ruleNumber) {
  const [rules, messages] = input.split('\n\n');
  const unparsedRules = scanRulesString(rules);
  const regexes = getRulesRegexes(unparsedRules);
  const ruleRegex = new RegExp(`^${regexes.get(ruleNumber)}$`);
  return messages
    .split('\n')
    .reduce((count, message) => message.match(ruleRegex) ? count + 1 : count, 0);
}

function scanRulesString(rules) {
  const rawRules = rules.match(/(\d+(?=\:))|((?<=: )(.*)(?=\n|$))/g);
  const unparsedRules = new Set();
  for (let i = 0; i < rawRules.length; i+=2) {
    unparsedRules.add([rawRules[i], rawRules[i + 1]]);
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
        if (tokens.some(token => token !== '|' && !regexes.has(token))) continue;

        parsedRule = tokens.reduce((string, token) => {
          const addition = token === '|' ? token : regexes.get(token);
          return string.concat(addition);
        }, '');
      }

      regexes.set(ruleNumber, `(${parsedRule})`);
      unparsedRules.delete(unparsedRule);
    }
  }
  return regexes;
}

console.log(countMessagesFollowingRule(rulesAndMessages, '0'));
