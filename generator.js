const { renderMapMarkdown, printMap, writeMapToMarkdown } = require("./printing");
const { setCell, createMap } = require("./map");

const { growTerrainSteps} = require("./terrain")


const map = createMap();
setCell(map, 0, 1, { terrain: "0", height: 0 }); // ocean seed point

const result = growTerrainSteps(map, 0, 0, 0, 2400);


