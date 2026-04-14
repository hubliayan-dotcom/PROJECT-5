// src/lib/grid.ts

export class GridEnvironment {
  rows: number;
  cols: number;
  grid: number[][];
  start: [number, number];
  goal: [number, number];

  constructor(rows = 25, cols = 25, obstacleDensity = 0.22) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    this.start = [1, 1];
    this.goal = [rows - 2, cols - 2];
    this.generate(obstacleDensity);
  }

  generate(density: number) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (Math.random() < density) {
          this.grid[r][c] = 1;
        } else {
          this.grid[r][c] = 0;
        }
      }
    }

    // Clear start and goal areas
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        for (const [br, bc] of [this.start, this.goal]) {
          const nr = br + dr;
          const nc = bc + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.grid[nr][nc] = 0;
          }
        }
      }
    }
  }
}
