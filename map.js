const {coordKey} = require("./utils")
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

module.exports = {setCell, getCell, createMap}