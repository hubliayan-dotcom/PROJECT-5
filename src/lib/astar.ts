// src/lib/astar.ts

export type Point = [number, number];

export function heuristic(a: Point, b: Point): number {
  // Manhattan distance
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(grid: number[][], start: Point, goal: Point): Point[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const openSet: [number, Point][] = [[0, start]];
  const cameFrom: Map<string, Point> = new Map();
  const gScore: Map<string, number> = new Map();
  const fScore: Map<string, number> = new Map();

  const startKey = start.join(',');
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, goal));

  while (openSet.length > 0) {
    // Sort by fScore (min-heap simulation)
    openSet.sort((a, b) => a[0] - b[0]);
    const [_, current] = openSet.shift()!;
    const currentKey = current.join(',');

    if (current[0] === goal[0] && current[1] === goal[1]) {
      const path: Point[] = [];
      let temp: Point | undefined = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom.get(temp.join(','));
      }
      return path.reverse();
    }

    const neighbors: Point[] = [
      [current[0] - 1, current[1]],
      [current[0] + 1, current[1]],
      [current[0], current[1] - 1],
      [current[0], current[1] + 1],
    ];

    for (const neighbor of neighbors) {
      const [r, c] = neighbor;
      if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 0) {
        const neighborKey = neighbor.join(',');
        const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + 1;

        if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeGScore);
          fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
          
          if (!openSet.some(item => item[1][0] === r && item[1][1] === c)) {
            openSet.push([fScore.get(neighborKey)!, neighbor]);
          }
        }
      }
    }
  }

  return [];
}
