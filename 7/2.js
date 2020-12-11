const fs = require('fs');

const bagInfo = fs.readFileSync(__dirname + '/input', 'utf8');

function countBagsWithinShinyGoldBag(input) {
  const containingBagGraph = getContainingBagGraph(input);
  let bagsCount = 0;
  const incrementBagsCount = (number) => bagsCount += number;
  countContainedBagsUsingDfs('shiny gold', containingBagGraph, incrementBagsCount);
  return bagsCount;
}

function getContainingBagGraph(input) {
  return input
    .split('\n')
    .reduce((map, bagInfo) => {
      const [container, ...containInfo] = bagInfo
        .match(/((\w+)\s(\w+))(?=(?<!other)\sbags?\b)|(?<=contain\s|bags?, )\d/g);

      map[container] = {};
      for (let i = 0; i < containInfo.length; i += 2) {
        const quantity = Number(containInfo[i]);
        const color = containInfo[i+1];
        map[container][color] = quantity;
      }
      return map;
    }, {});
}

function countContainedBagsUsingDfs(containingColor, bagGraph, increment, multiplier = 1) {
  for (const [color, bagCount] of Object.entries(bagGraph[containingColor])) {
      const realBagCount = bagCount * multiplier;
      increment(realBagCount);
      countContainedBagsUsingDfs(color, bagGraph, increment, realBagCount);
  }
}

console.log(countBagsWithinShinyGoldBag(bagInfo));
