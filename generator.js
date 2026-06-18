const { renderMapMarkdown, printMap, writeMapToMarkdown } = require("./printing");
const { setCell, getCell, createMap } = require("./map");
const {
  chooseTerrainFromNeighbours,
  checkNeighbours,
  getFrontier,
  addFrontierAroundPoint,
  selectFrontierPoint,
} = require("./frontier");
const {coordKey} = require("./utils")
function growTerrain(map, activeX, activeY, frontier = null) {
  // grows terrain (land/ocean) by 1 cell
  if (getCell(map, activeX, activeY) === undefined) {
    setCell(map, activeX, activeY, "1");
  }

  const frontierState = frontier ?? getFrontier(map);
  const selectedPoint = selectFrontierPoint(map, frontierState);

  if (selectedPoint === null) {
    return {
      map,
      activeLocation: { x: activeX, y: activeY },
      frontier: frontierState,
    };
  }

  const value = chooseTerrainFromNeighbours(map, selectedPoint);
  setCell(map, selectedPoint.x, selectedPoint.y, value);
  frontierState.delete(coordKey(selectedPoint.x, selectedPoint.y));
  addFrontierAroundPoint(map, frontierState, selectedPoint);

  writeMapToMarkdown(map);
  // printMap(map);

  return {
    map,
    activeLocation: { x: selectedPoint.x, y: selectedPoint.y },
    frontier: frontierState,
  };
}

function growTerrainSteps(
  map,
  activeX,
  activeY,
  step = 0,
  maxSteps = 1000,
  frontier = null,
) {
  // repeat growTerrain up to maxSteps
  if (step === 0 && getCell(map, activeX, activeY) === undefined) {
    setCell(map, activeX, activeY, "1");
  }

  if (step >= maxSteps) {
    return { map, activeLocation: { x: activeX, y: activeY }, step };
  }

  const frontierState = frontier ?? getFrontier(map);

  const result = growTerrain(map, activeX, activeY, frontierState);

  setTimeout(() => {
    growTerrainSteps(
      result.map,
      result.activeLocation.x,
      result.activeLocation.y,
      step + 1,
      maxSteps,
      result.frontier,
    );
  }, 0);
  // ^ update for speed
}


const map = createMap();
setCell(map, 0, 1, "1"); // equivalent of your old second seed point, one cell off-origin

const result = growTerrainSteps(map, 0, 0);

module.exports = {
  createMap,
  printMap,
  getCell,
  setCell,
  checkNeighbours,
  getFrontier,
  chooseTerrainFromNeighbours,
  writeMapToMarkdown,
  growTerrain,
  growTerrainSteps,
};
