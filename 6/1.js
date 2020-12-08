/*
  Both ran at a similar speed but the single loop one (which iterates over the original string rather than creating an array)
  was slightly faster: https://jsben.ch/dcKTy

  If in getSumOfGroupsQuestionCountsWithMultipleLoops we do
    const form = forms[i].replace(/\n/g, '');
  instead of just skiping the newline like we do:
    if (char === '\n' || groupQuestionsAnswered.has(char)) continue;
  it slows things down significantly - so the small extra string loop for each form matters. 
  */

const fs = require('fs');
 
const forms = fs.readFileSync(__dirname + '/input', 'utf8');

function getSumOfGroupsQuestionCountsWithSingleLoop(input) {
  const formQuestionsAnswered = new Set();
  let sumOfCounts = 0;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '\n') {
      if (input[i + 1] === '\n') {
        formQuestionsAnswered.clear();
        i++;
      }
      continue;
    }
    if (formQuestionsAnswered.has(char)) continue;
    formQuestionsAnswered.add(char);
    sumOfCounts++;
  }

  return sumOfCounts;
}

console.log(getSumOfGroupsQuestionCountsWithSingleLoop(forms));


function getSumOfGroupsQuestionCountsWithMultipleLoops(input) {
  const forms = input.split('\n\n');
  let sumOfCounts = 0;
  const groupQuestionsAnswered = new Set();
  
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    for (let j = 0; j < form.length; j++) {
      const char = form[j];
      if (char === '\n' || groupQuestionsAnswered.has(char)) continue;
      groupQuestionsAnswered.add(char);  
      sumOfCounts++;
    }
    groupQuestionsAnswered.clear();
  }
  
  return sumOfCounts;
}

console.log(getSumOfGroupsQuestionCountsWithMultipleLoops(forms));
