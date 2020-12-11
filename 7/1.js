const fs = require('fs');

const bagInfo = fs.readFileSync(__dirname + '/input', 'utf8');

function countShinyGoldBagContainers(input) {
  const bagGraph = input
    .split('\n')
    .reduce((map, bagInfo) => {
      const colors = bagInfo.match(/((\w+)\s(\w+))(?=(?<!other)\sbags?\b)/g);
      const [container, ...contained] = colors;
      contained.forEach(color => {
        map[color] = map[color] || new Set();
        map[color].add(container);
      });
      return map;
    }, {});

  const containers = new Set();
  findContainingBagsUsingDfs('shiny gold', bagGraph, containers);
  return containers.size;
}

function findContainingBagsUsingDfs(containedColor, bagGraph, containers) {
  if (!bagGraph[containedColor]) return;
  for (const color of bagGraph[containedColor]) {
    if (!containers.has(color)) {
      containers.add(color);
      findContainingBagsUsingDfs(color, bagGraph, containers)
    }
  }
}

console.log(countShinyGoldBagContainers(bagInfo));
