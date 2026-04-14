# python/simulation/main_sim.py
import pygame, sys, time
import os

# Add parent to path to allow imports from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulation.grid_env import GridEnvironment
from src.astar import astar

CELL_SIZE=28; ROWS=COLS=25; FPS=15
WIDTH=COLS*CELL_SIZE; HEIGHT=ROWS*CELL_SIZE+60
BG=(15,15,30); WHITE=(255,255,255); GRAY=(60,60,60)
GREEN=(50,200,50); RED=(220,50,50); BLUE=(50,100,220)
CYAN=(0,200,200); YELLOW=(255,220,0); PURPLE=(150,50,200)

def draw_grid(screen, env, path, visited, agent, font):
    screen.fill(BG)
    for r in range(env.rows):
        for c in range(env.cols):
            x, y = c*CELL_SIZE, r*CELL_SIZE
            rect = pygame.Rect(x, y, CELL_SIZE, CELL_SIZE)
            pos  = (r, c)
            if   pos == env.start:      pygame.draw.rect(screen, GREEN,  rect)
            elif pos == env.goal:       pygame.draw.rect(screen, RED,    rect)
            elif pos == agent:
                pygame.draw.rect(screen, BLUE, rect)
                pygame.draw.circle(screen, CYAN,
                    (x+CELL_SIZE//2, y+CELL_SIZE//2), CELL_SIZE//3)
            elif env.is_obstacle(r,c):  pygame.draw.rect(screen, GRAY,   rect)
            elif pos in path:           pygame.draw.rect(screen, YELLOW, rect)
            elif pos in visited:        pygame.draw.rect(screen, PURPLE, rect)
            else:                       pygame.draw.rect(screen, BG,     rect)
            pygame.draw.rect(screen,(40,40,60),rect,1)

def run_simulation(save_path=None):
    try:
        pygame.init()
    except Exception as e:
        print(f"Pygame could not be initialized: {e}")
        return

    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption('AI Autonomous Navigation')
    clock = pygame.time.Clock()
    font  = pygame.font.SysFont('Arial', 16, bold=True)
    env   = GridEnvironment(ROWS, COLS, obstacle_density=0.22)
    
    # Ensure path exists
    path = []
    for _ in range(10):
        path = astar(env.to_list(), env.start, env.goal)
        if path: break
        env.generate()
        
    path_set=set(path); visited=set()
    agent=env.start; step=0; frame=0; hold=FPS*2
    navigating=False; running=True
    
    while running:
        for e in pygame.event.get():
            if e.type==pygame.QUIT: running=False
            if e.type==pygame.KEYDOWN:
                if e.key==pygame.K_r: return run_simulation(save_path)
                if e.key==pygame.K_q: running=False
        
        frame+=1
        if frame>hold: navigating=True
        if navigating and step<len(path):
            agent=path[step]; visited.add(agent); step+=1
        
        draw_grid(screen, env, path_set, visited, agent, font)
        status='GOAL REACHED! Ctrl+R to regenerate' if agent==env.goal else f'Steps: {step}'
        pygame.draw.rect(screen,(30,30,50),pygame.Rect(0,ROWS*CELL_SIZE,WIDTH,60))
        screen.blit(font.render(status,True,WHITE),(10,ROWS*CELL_SIZE+20))
        
        pygame.display.flip(); clock.tick(FPS)
        
        if save_path and agent==env.goal:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            pygame.image.save(screen, save_path)
            print(f'Screenshot saved to {save_path}')
            save_path = None # Only save once
            
    pygame.quit()

if __name__=='__main__':
    run_simulation('outputs/screenshots/final_run.png')
