const fs = require('fs');

const formsInput = fs.readFileSync(__dirname + '/input', 'utf8');

function getUnanimousQuestionCount(input) {
  const forms = input.split('\n\n');

  return forms
    .reduce((count, form) => {
      let unanimousQuestions = 0;
      const charCounts = {};
      const people = form.split('\n');

      if (people.length === 1) return count + people[0].length;

      people.forEach(person => {
        for (let i = 0; i < person.length; i++) {
          const char = person[i];
          charCounts[char] = charCounts[char] ? charCounts[char] + 1 : 1;
        }
      });

      for (let i = 0; i < people[0].length; i++) {
        const char = people[0][i];
        if (charCounts[char] === people.length) unanimousQuestions++;
      }

      return count + unanimousQuestions;
    }, 0);
}

console.log(getUnanimousQuestionCount(formsInput));
