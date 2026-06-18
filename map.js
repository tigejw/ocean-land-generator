const {coordKey} = require("./utils")

function createCell(terrain = undefined, height = undefined) {
  return { terrain, height };
}
function createMap() {
  //map stored as flat hash map by key "x,y". bounds tracks grid required to contain the terrain
  return {
    cells: new Map(),
    bounds: null, // { minX, maxX, minY, maxY }
  };
}

function getCell(map, x, y) {
  // returns value of position, or undefined if that cell empty
  //0,0 center point
  return map.cells.get(coordKey(x, y));
}

function getCellTerrain(cell) {
  if (cell === undefined) return undefined;
  if (typeof cell === "string") return cell;
  return cell.terrain;
}

function getCellHeight(cell) {
  if (cell === undefined) return undefined;
  if (typeof cell === "string") return undefined;
  return cell.height;
}

function setCellTerrain(map, x, y, terrain) {
  const existing = getCell(map, x, y);
  const nextCell =
    existing === undefined || typeof existing === "string"
      ? createCell(terrain)
      : { ...existing, terrain };

  return setCell(map, x, y, nextCell);
}

function setCellHeight(map, x, y, height) {
  const existing = getCell(map, x, y);
  const nextCell =
    existing === undefined
      ? createCell(undefined, height)
      : typeof existing === "string"
      ? createCell(existing, height)
      : { ...existing, height };

  return setCell(map, x, y, nextCell);
}

function setCell(map, x, y, value) {
  // sets value of position. always succeeds since there are no bounds to hit.
  map.cells.set(coordKey(x, y), value);

  if (!map.bounds) {
    map.bounds = { minX: x, maxX: x, minY: y, maxY: y };
  } else {
    map.bounds.minX = Math.min(map.bounds.minX, x);
    map.bounds.maxX = Math.max(map.bounds.maxX, x);
    map.bounds.minY = Math.min(map.bounds.minY, y);
    map.bounds.maxY = Math.max(map.bounds.maxY, y);
  }

  return true;
}

module.exports = {
  setCell,
  getCell,
  createMap,
  createCell,
  getCellTerrain,
  getCellHeight,
  setCellTerrain,
  setCellHeight,
}