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

function growTerrain(map, activeX, activeY) {
  //takes map and active location coords. selects random direction and goes along until blank coords reached. 50/50s ocean/land. returns map and new active coords
  if (getPoint(map, activeX, activeY) === "") {
    setPoint(map, activeX, activeY, "1");
  }

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const direction = directions[Math.floor(Math.random() * directions.length)];

  let currentX = activeX + direction.x;
  let currentY = activeY + direction.y;

  while (
    getPoint(map, currentX, currentY) !== undefined &&
    getPoint(map, currentX, currentY) !== ""
  ) {
    currentX += direction.x;
    currentY += direction.y;
  }

  let activeLocation = { x: activeX, y: activeY };

  if (getPoint(map, currentX, currentY) === "") {
    const value = Math.random() < 0.5 ? "1" : "0";
    setPoint(map, currentX, currentY, value);
    activeLocation = { x: currentX, y: currentY };
  }

  return {
    map,
    activeLocation,
  };
}

function growTerrainSteps(map, activeX, activeY, step = 0, maxSteps = 300) {
  //repeat growTerrain to limit
  if (step >= maxSteps) {
    return {
      map,
      activeLocation: { x: activeX, y: activeY },
      step,
    };
  }

  const result = growTerrain(map, activeX, activeY);

  return growTerrainSteps(
    result.map,
    result.activeLocation.x,
    result.activeLocation.y,
    step + 1,
    maxSteps,
  );
}

const map = createMap(100, 100);
// console.log(map);

const result = growTerrainSteps(map, 50, 50);

printMap(map);

module.exports = {
  createMap,
  printMap,
  getPoint,
  setPoint,
  growTerrain,
  growTerrainSteps,
};
