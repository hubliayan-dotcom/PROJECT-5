# python/simulation/grid_env.py
import numpy as np
import random

class GridEnvironment:
    def __init__(self, rows=25, cols=25, obstacle_density=0.22):
        self.rows = rows
        self.cols = cols
        self.obstacle_density = obstacle_density
        self.grid = None
        self.start = None
        self.goal  = None
        self.generate()

    def generate(self):
        self.grid = np.zeros((self.rows, self.cols), dtype=int)
        for r in range(self.rows):
            for c in range(self.cols):
                if random.random() < self.obstacle_density:
                    self.grid[r][c] = 1
        self.start = (1, 1)
        self.goal  = (self.rows - 2, self.cols - 2)
        # Clear area around start and goal so path always exists
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                for (br, bc) in [self.start, self.goal]:
                    nr, nc = br+dr, bc+dc
                    if 0 <= nr < self.rows and 0 <= nc < self.cols:
                        self.grid[nr][nc] = 0

    def is_obstacle(self, r, c): return self.grid[r][c] == 1
    def to_list(self):           return self.grid.tolist()
