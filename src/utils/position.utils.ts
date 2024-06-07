export function blurPosition(coords: number[]) {
  const bluredCoords = coords.map(
    (coord) => (coord * 1000000 + Math.round(Math.random() * 100)) / 1000000
  );
  return bluredCoords;
}
