const fs = require("fs");
const { getCell } = require("./map");
const mapOutputFile = "./map.md";


function renderMapMarkdown(map) {
  // render map as text for printing/display within bounds of terrain
  if (!map.bounds) return "";

  const { minX, maxX, minY, maxY } = map.bounds;
  const lines = [];

  for (let y = maxY; y >= minY; y--) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
      const cell = getCell(map, x, y);
      if (cell === undefined) row.push(" ");
      else if (cell === "1") row.push("■");
      else row.push("□");
    }
    lines.push(row.join(" "));
  }

  return lines.join("\n");
}

function printMap(map) {
  // prints map to console
  if (!map.bounds) return;

  const { minX, maxX, minY, maxY } = map.bounds;

  for (let y = maxY; y >= minY; y--) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
      const cell = getCell(map, x, y);
      if (cell === undefined) row.push("□");
      else if (cell === "1") row.push("■");
      else row.push("▤");
    }
    console.log(row.join(" "));
  }
}

function writeMapToMarkdown(map, filePath = mapOutputFile) {
  fs.writeFileSync(filePath, renderMapMarkdown(map));
}

module.exports = { renderMapMarkdown, printMap, writeMapToMarkdown };
