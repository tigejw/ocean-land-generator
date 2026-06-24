const { getCell, getCellTerrain } = require("./map");
const { coordKey, parseCoordKey } = require("./utils");

const neighbourOffsets = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
];

function getNeighbourTerrainCounts(map, { x, y }) {
  //return the number of land and ocean cells in the 8 neighbouring cells
  let landCount = 0;
  let oceanCount = 0;

  neighbourOffsets.forEach((offset) => {
    const neighbour = getCell(map, x + offset.x, y + offset.y);

    const terrain = getCellTerrain(neighbour);
    if (terrain === "1") landCount += 1;
    if (terrain === "0") oceanCount += 1;
  });

  return { landCount, oceanCount };
}

function chooseTerrainFromNeighbours(map, point) {
  const { landCount, oceanCount } = getNeighbourTerrainCounts(map, point);

  // strong majority of neighbours ensures new cell is same terrain type as neighbours
  if (landCount >= 6) return "1";
  if (oceanCount >= 6) return "0";

  const landWeight = landCount + 1;
  const oceanWeight = oceanCount + 1;
  const totalWeight = landWeight + oceanWeight;

  return Math.random() < landWeight / totalWeight ? "1" : "0";
}

function checkNeighbours(map, { x, y }, minValidNeighbours = 2) {
  let neighbourCount = 0;

  neighbourOffsets.forEach((offset) => {
    const neighbour = getCell(map, x + offset.x, y + offset.y);
    if (neighbour !== undefined) neighbourCount += 1;
  });

  return neighbourCount >= minValidNeighbours;
}

function getDistanceToCenter(_map, { x, y }) {
  return Math.sqrt(x * x + y * y);
}

function getFrontier(map) {
  const frontier = new Set();

  map.cells.forEach((_value, key) => {
    const { x, y } = parseCoordKey(key);

    neighbourOffsets.forEach((offset) => {
      const neighbourX = x + offset.x;
      const neighbourY = y + offset.y;

      if (
        getCell(map, neighbourX, neighbourY) === undefined &&
        checkNeighbours(map, { x: neighbourX, y: neighbourY }, 2)
      ) {
        frontier.add(coordKey(neighbourX, neighbourY));
      }
    });
  });

  return frontier;
}

function addFrontierAroundPoint(map, frontier, { x, y }) {
  neighbourOffsets.forEach((offset) => {
    const neighbourX = x + offset.x;
    const neighbourY = y + offset.y;

    if (
      getCell(map, neighbourX, neighbourY) === undefined &&
      checkNeighbours(map, { x: neighbourX, y: neighbourY }, 2)
    ) {
      frontier.add(coordKey(neighbourX, neighbourY));
    }
  });
}

function selectFrontierPoint(map, frontier) {
  let selectedPoint = null;

  frontier.forEach((key) => {
    const point = parseCoordKey(key);
    const distance = getDistanceToCenter(map, point);
    const adjustedDistance = distance * (1 + Math.random() * 20);

    if (
      selectedPoint === null ||
      adjustedDistance < selectedPoint.adjustedDistance
    ) {
      selectedPoint = { ...point, adjustedDistance };
    }
  });

  return selectedPoint;
}

module.exports = {
  neighbourOffsets,
  getNeighbourTerrainCounts,
  chooseTerrainFromNeighbours,
  checkNeighbours,
  getDistanceToCenter,
  getFrontier,
  addFrontierAroundPoint,
  selectFrontierPoint,
};