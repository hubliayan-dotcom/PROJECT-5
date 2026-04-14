# python/src/astar.py
import heapq

def heuristic(a, b):
    # Manhattan distance for 4-directional grid movement
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]   # Reverse: start -> goal

        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            neighbor = (current[0]+dr, current[1]+dc)
            r, c = neighbor
            if not (0 <= r < rows and 0 <= c < cols): continue
            if grid[r][c] == 1: continue   # Skip obstacles
            tentative_g = g_score[current] + 1
            if neighbor not in g_score or tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
    return []   # No path found
