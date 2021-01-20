function getBorderlessImage(input) {
  const rawTiles = input.split('\n\n');
  const bordersMap = createBordersMap(rawTiles);
  console.log('bordersMap', bordersMap)
  const topLeftTileId = decideTopLeftTile(bordersMap)
  const grid = populateGrid(rawTiles.length, bordersMap, topLeftTileId);
}

function populateGrid(totalTiles, bordersMap, topLeftTileId) {
  const borders = bordersMap.get('borders');
  const tiles = bordersMap.get('tiles');
  const grid = getGrid(totalTiles);
  grid[0][0] = topLeftTileId;
  for (let i = 1; i < grid[0].length; i++) {
    const tileToTheLeftId = grid[0][i - 1];
    console.log('tiles.get(tileToTheLeftId)', tiles.get(tileToTheLeftId))
    const currentTileLeftBorder = tiles.get(tileToTheLeftId).right;
    console.log('borders.get(currentTileLeftBorder)', borders.get(currentTileLeftBorder))
    const currentTileId = borders.get(currentTileLeftBorder).find(id => id !== tileToTheLeftId);
    console.log('currentTileId', currentTileId)
  }
}

function decideTopLeftTile(bordersMap) {
  const borders = bordersMap.get('borders');
  let topLeftTileId = null, borderToGoTop = null;
  const uniqueBorderCounts = new Map();
  while (!topLeftTileId) {
    for (const [border, ids] of borders.entries()) {
      if (ids.length > 1) continue;
      let count = uniqueBorderCounts.get(ids[0]) ?? 0;
      count++;
      uniqueBorderCounts.set(ids[0], count);
      if (count === 2) {
        topLeftTileId = ids[0];
        borderToGoTop = border;
      }
    }
  }
  const rotated = rotateTileUntilBorderIsTop(topLeftTileId, bordersMap, borderToGoTop);
  console.log('rotated.right', rotated.right)
  console.log('borders.get(rotated.right)', borders.get(rotated.right))
  if (borders.get(rotated.right).length === 1) {
    rotateTileUntilBorderIsTop(topLeftTileId, bordersMap, rotated.right);
  }
  return topLeftTileId;
}

function rotateTileUntilBorderIsTop(tileId, bordersMap, borderToGoTop) {
  let { left, right, top, bottom } = bordersMap.get('tiles').get(tileId);
  while (top !== borderToGoTop) {
    const tempTop = top;
    top = left;
    left = bottom;
    bottom = right;
    right = tempTop;
  }
  bordersMap.get('tiles').set(tileId, { left, right, top, bottom });
  return bordersMap.get('tiles').get(tileId);
}

function getGrid(totalTiles) {
  const rowColLength = Math.sqrt(totalTiles);
  return [...Array(rowColLength)].map(() => [...Array(rowColLength)]);
} 

function createBordersMap(tiles) {
  return tiles.reduce((map, tile) => {
    const [id, ...pattern] = tile.match(/\d+|[.#]+/g);
    return addBorders(map, Number(id), pattern);
  }, new Map([['borders', new Map()], ['tiles', new Map()]]));
}

function addBorders(map, id, pattern) {
  const bordersForTile = getBorderStrings(pattern);
  map.get('tiles').set(id, bordersForTile);

  const borders = map.get('borders');
  Object.values(bordersForTile).forEach((border) => {
    let idsWithBorder = borders.get(border) ?? borders.get(reverseString(border));
    if (!idsWithBorder) {
      idsWithBorder = [];
      borders.set(border, idsWithBorder);
    }
    idsWithBorder.push(id);
  });
  return map;
}

function getBorderStrings(pattern) {
  return pattern.reduce((border, line, idx) => {
    if (idx === 0) border.top = line;
    if (idx === pattern.length - 1) border.bottom = line;
    border.left += line[0];
    border.right += line[line.length - 1];
    return border;
  }, { left: '', right: '' });
}

function reverseString(string) {
  return string.split('').reverse().join('');
}


const testInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

const assert = require('assert');
const { getgroups } = require('process');
assert.equal(getBorderlessImage(testInput), `.#.#..#.##...#.##..#####
###....#.#....#..#......
##.##.###.#.#..######...
###.#####...#.#####.#..#
##.#....#.##.####...#.##
...########.#....#####.#
....#..#...##..#.#.###..
.####...#..#.....#......
#..#.##..#..###.#.##....
#.####..#.####.#.#.###..
###.#.#...#.######.#..##
#.####....##..########.#
##..##.#...#...#.#.#.#..
...#..#..#.#.##..###.###
.#.#....#.##.#...###.##.
###.#...#..#.##.######..
.#.#.###.##.##.#..#.##..
.####.###.#...###.#..#.#
..#.#..#..#.#.#.####.###
#..####...#.#.#.###.###.
#####..#####...###....##
#.##..#..#...#..####...#
.#.###..##..##..####.##.
...###...##...#...#..###`);