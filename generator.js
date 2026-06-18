function createMap(width, height) {
  const blank = [];

  for (let yIndex = 0; yIndex < height; yIndex++) {
    const row = [];

    for (let xIndex = 0; xIndex < width; xIndex++) {
      row.push("");
    }

    blank.push(row);
  }

  return blank;
}

function printMap(map) {
  for (let yIndex = map.length - 1; yIndex >= 0; yIndex--) {
    const displayRow = map[yIndex].map((grid) => {
      if (grid === "") return "□";
      if (grid === "1") return "■";
      if (grid === "0") return "▤";
      return "□";
    });

    console.log(displayRow.join(" "));
  }
}

function getPoint(map, x, y) {
  //returns value of position. bottom left of map is 1,1
  return map[y - 1]?.[x - 1];
}

function setPoint(map, x, y, value) {
  //sets value of position with bottom left being 1,1
  if (!map[y - 1] || map[y - 1][x - 1] === undefined) {
    return false;
  }

  map[y - 1][x - 1] = value;
  return true;
}

function checkNeighbours(map, { x, y }, minValidNeighbours = 2) {
  //checks if inputted point has atleast 2 neighbours
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

  let neighbourCount = 0;

  neighbourOffsets.forEach((offset) => {
    const neighbour = getPoint(map, x + offset.x, y + offset.y);

    if (neighbour !== undefined && neighbour !== "") {
      neighbourCount += 1;
    }
  });

  return neighbourCount >= minValidNeighbours;
}

function getMapDimensions(map) {
  return {
    width: map[0]?.length ?? 0,
    height: map.length,
  };
}

function getCenterPoint(map) {
  const { width, height } = getMapDimensions(map);

  return {
    x: (width + 1) / 2,
    y: (height + 1) / 2,
  };
}

function getDistanceToCenter(map, { x, y }) {
  const center = getCenterPoint(map);
  const deltaX = x - center.x;
  const deltaY = y - center.y;

  return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
}

function coordKey(x, y) {
  return `${x},${y}`;
}

function parseCoordKey(key) {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

function getFrontier(map) {
  const frontier = new Set();
  const { width, height } = getMapDimensions(map);

  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      const point = { x, y };

      if (getPoint(map, x, y) === "" && checkNeighbours(map, point, 2)) {
        frontier.add(coordKey(x, y));
      }
    }
  }

  return frontier;
}

function addFrontierAroundPoint(map, frontier, { x, y }) {
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

  neighbourOffsets.forEach((offset) => {
    const neighbourX = x + offset.x;
    const neighbourY = y + offset.y;

    if (getPoint(map, neighbourX, neighbourY) === "" && checkNeighbours(map, { x: neighbourX, y: neighbourY }, 2)) {
      frontier.add(coordKey(neighbourX, neighbourY));
    }
  });
}

function selectFrontierPoint(map, frontier) {
  let selectedPoint = null;

  frontier.forEach((key) => {
    const point = parseCoordKey(key);
    const distance = getDistanceToCenter(map, point);
    const adjustedDistance = distance * (1 + (Math.random() * 20));
    //^^adjust this *1 to increase or decrease randomness. higher = more random
    if (selectedPoint === null || adjustedDistance < selectedPoint.adjustedDistance) {
      selectedPoint = {
        ...point,
        adjustedDistance,
      };
    }
  });

  return selectedPoint;
}

function growTerrain(map, activeX, activeY, frontier = null) {
  if (getPoint(map, activeX, activeY) === "") {
    setPoint(map, activeX, activeY, "1");
  }

  const frontierState = frontier ?? getFrontier(map);
  const activeLocation = { x: activeX, y: activeY };
  const selectedPoint = selectFrontierPoint(map, frontierState);

  if (selectedPoint === null) {
    return { map, activeLocation, frontier: frontierState };
  }

  const value = Math.random() < 0.5 ? "1" : "0";
  setPoint(map, selectedPoint.x, selectedPoint.y, value);
  frontierState.delete(coordKey(selectedPoint.x, selectedPoint.y));
  addFrontierAroundPoint(map, frontierState, selectedPoint);

  printMap(map);

  return {
    map,
    activeLocation: { x: selectedPoint.x, y: selectedPoint.y },
    frontier: frontierState,
  };
}



function growTerrainSteps(map, activeX, activeY, step = 0, maxSteps = 400, frontier = null) {
  //repeat growTerrain to limit
  if (step === 0 && getPoint(map, activeX, activeY) === "") {
    setPoint(map, activeX, activeY, "1");
  }

  if (step >= maxSteps) {
    return {
      map,
      activeLocation: { x: activeX, y: activeY },
      step,
    };
  }

  const frontierState = frontier ?? getFrontier(map);

  if (frontierState.size === 0) {
    return {
      map,
      activeLocation: { x: activeX, y: activeY },
      step,
      frontier: frontierState,
    };
  }

  const result = growTerrain(map, activeX, activeY, frontierState);
  setTimeout(() => {
    return growTerrainSteps(
      result.map,
      result.activeLocation.x,
      result.activeLocation.y,
      step + 1,
      maxSteps,
      result.frontier,
    );
  }, 100)
}

const map = createMap(30, 30);
setPoint(map, 15, 16, "1");

const result = growTerrainSteps(map, 15, 15);

// printMap(map);

module.exports = {
  createMap,
  printMap,
  getPoint,
  setPoint,
  checkNeighbours,
  getFrontier,
  growTerrain,
  growTerrainSteps,
};
