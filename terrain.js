const { getCell, setCellTerrain, setCellHeight } = require("./map");
const {
  chooseTerrainFromNeighbours,
  getNeighbourTerrainCounts,
  getFrontier,
  addFrontierAroundPoint,
  selectFrontierPoint,
} = require("./frontier");
const { writeMapToMarkdown } = require("./printing");

const {coordKey} = require("./utils")

function calculateHeightFromNeighbours(map, point, variation = 5) {
  const { landCount, oceanCount } = getNeighbourTerrainCounts(map, point);
  const neighbourTotal = landCount + oceanCount;
  const neighbourRatio =
    neighbourTotal === 0 ? 0 : (landCount - oceanCount) / neighbourTotal;
    return Math.round(neighbourRatio * Math.random() * variation)

}

function growTerrain(map, activeX, activeY, frontier = null) {
  // grows terrain (land/ocean) by 1 cell
  if (getCell(map, activeX, activeY) === undefined) {
    setCellTerrain(map, activeX, activeY, "1");
    setCellHeight(map, activeX, activeY, 1);
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

    const terrain = chooseTerrainFromNeighbours(map, selectedPoint);
    setCellTerrain(map, selectedPoint.x, selectedPoint.y, terrain);
  setCellHeight(
    map,
    selectedPoint.x,
    selectedPoint.y,
    calculateHeightFromNeighbours(map, selectedPoint),
  );
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
  maxSteps = 10,
  frontier = null,
) {
  // repeat growTerrain up to maxSteps
  if (step === 0 && getCell(map, activeX, activeY) === undefined) {
    setCellTerrain(map, activeX, activeY, "1");
    setCellHeight(map, activeX, activeY, 1);
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

module.exports = { growTerrain, growTerrainSteps, calculateHeightFromNeighbours };