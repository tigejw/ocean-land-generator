const fs = require("fs");
const { getCell, getCellTerrain } = require("./map");
const mapOutputFile = "./map.md";


function renderMapHTML(map) {
  if (!map.bounds) return "<html><body>No map bounds defined.</body></html>";

  const { minX, maxX, minY, maxY } = map.bounds;
  const width = (maxX - minX) + 1;
  const height = (maxY - minY) + 1;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Terrain Live Preview</title>
    <style>
        body { 
            background-color: #000000; 
            color: #a04040; 
            font-family: system-ui, sans-serif; 
            padding: 20px; 
            margin: 0;
        }
        .info-panel { margin-bottom: 15px; font-size: 14px; }
        .map-grid { 
            display: grid; 
            grid-template-columns: repeat(${width}, 24px); 
            gap: 2px; 
            background-color: #2d2d2d; 
            padding: 4px; 
            width: max-content;
            border-radius: 4px;
        }
        .cell { 
            width: 24px; 
            height: 24px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            font-weight: bold;
            border-radius: 2px;
            user-select: none;
            transition: transform 0.1s ease;
        }
        .terrain-land { background-color: #2e7d32; color: #fff; } /* land */
        .terrain-ocean { background-color: #002358; color: #333; } /* ocean */
        .terrain-empty  { background-color: #b3acac; border: 1px dashed #444; }  /* void */
    </style>
</head>
<body>
    <div class="info-panel">
        <strong>Map Dimensions:</strong> ${width} x ${height} | 
        <strong>Bounds:</strong> X(${minX} to ${maxX}), Y(${minY} to ${maxY})
    </div>
    <div class="map-grid">`;

  // Maintain your exact inverted Y-axis matching your original print loop
  for (let y = maxY; y >= minY; y--) {
    for (let x = minX; x <= maxX; x++) {
      const cell = getCell(map, x, y);
      
      if (cell === undefined) {
        html += `\n        <div class="cell terrain-empty" title="X: ${x}, Y: ${y}\nEmpty"></div>`;
      } else {
        const terrain = getCellTerrain(cell);
        const cellClass = terrain === "1" ? "terrain-land" : "terrain-ocean";
        
        html += `\n        <div class="cell ${cellClass}" title="X: ${x}, Y: ${y}\nTerrain: ${terrain}">${cell.height}</div>`;
      }
    }
  }

  html += `\n    </div>
</body>
</html>`;

  return html;
}


function writeMapToHTML(map, filePath = mapOutputFile) {
  fs.writeFileSync("./map.html", renderMapHTML(map));
}

/*
// prints map to console

function printMap(map) {
  if (!map.bounds) return;

  const { minX, maxX, minY, maxY } = map.bounds;

  for (let y = maxY; y >= minY; y--) {
    const row = [];
    for (let x = minX; x <= maxX; x++) {
      const cell = getCell(map, x, y);
      if (cell === undefined) row.push("□");
      else if (getCellTerrain(cell) === "1") row.push("■");
      else row.push("▤");
    }
    console.log(row.join(" "));
  }
}
*/



/*

//renders map to markdown

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
      else if (getCellTerrain(cell) === "1") row.push("■");
      else row.push("□");
    }
    lines.push(row.join(" "));
  }

  return lines.join("\n");
}

function writeMapToMarkdown(map, filePath = mapOutputFile) {
  fs.writeFileSync(filePath, renderMapMarkdown(map));
}
*/

module.exports = { renderMapHTML, writeMapToHTML };
