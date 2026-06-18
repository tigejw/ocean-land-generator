function coordKey(x, y) {
  // format coords as string for storage
  return `${x},${y}`;
}

function parseCoordKey(key) {
  // parse coords string back to numbers
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

module.exports = {coordKey, parseCoordKey}