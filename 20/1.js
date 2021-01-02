const fs = require('fs');
const tiles = fs.readFileSync(__dirname + '/input', 'utf8');

function multiplyIdsOfCornerTiles(input) {
  const bordersMap = createBordersMap(input.split('\n\n'));
  const cornerTileIds = findIdsWithTwoUniqueBorders(bordersMap);
  return cornerTileIds.reduce((product, id) => product * id);
}

function createBordersMap(tiles) {
  return tiles.reduce((map, tile) => {
    const [id, ...pattern] = tile.match(/\d+|[.#]+/g);
    return addBorders(map, Number(id), pattern);
  }, new Map());
}

function addBorders(map, id, pattern) {
  const borders = getBorderStrings(pattern);
  borders.forEach((border) => {
    let idsWithBorder = map.get(border) ?? map.get(reverseString(border));
    if (!idsWithBorder) {
      idsWithBorder = [];
      map.set(border, idsWithBorder);
    }
    idsWithBorder.push(id);
  });
  return map;
}

function getBorderStrings(pattern) {
  const sides = pattern.reduce((border, line, idx) => {
    if (idx === 0) border.top = line;
    if (idx === pattern.length - 1) border.bottom = line;
    border.left += line[0];
    border.right += line[line.length - 1];
    return border;
  }, { left: '', right: '' });
  return Object.values(sides);
}

function findIdsWithTwoUniqueBorders(bordersMap) {
  const uniqueBorderCounts = new Map();
  const cornerTileIds = [];
  for (let ids of bordersMap.values()) {
    if (ids.length > 1) continue;
    let count = uniqueBorderCounts.get(ids[0]) ?? 0;
    count++;
    uniqueBorderCounts.set(ids[0], count);
    if (count === 2) cornerTileIds.push(ids[0]);
  }
  return cornerTileIds;
}

function reverseString(string) {
  return string.split('').reverse().join('');
}

console.log(multiplyIdsOfCornerTiles(tiles));
