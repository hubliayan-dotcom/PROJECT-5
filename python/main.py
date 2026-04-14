# python/main.py
import argparse, os
import sys

# Add current dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_simulation():
    try:
        from simulation.main_sim import run_simulation as sim
        sim(save_path='outputs/screenshots/final_sim_run.png')
    except ImportError:
        print("Simulation module requires Pygame. Run: pip install pygame")

def run_detection():
    try:
        from src.yolo_detect import ObjectDetector
        d=ObjectDetector('yolov8n')
        img='data/test_image.jpg'
        if not os.path.exists(img):
            print('Place a road image at data/test_image.jpg'); return
        _,dets=d.detect(img)
        for det in dets:
            print(f"  {det['class']} ({det['confidence']}) -> {det['action']}")
    except ImportError:
        print("Detection module requires OpenCV and Ultralytics.")

def run_graphs():
    import time
    try:
        from simulation.grid_env import GridEnvironment
        from src.astar import astar
        from src.graph_results import plot_path_on_grid, plot_performance_metrics
        lengths,times=[],[];last_env=last_path=None
        for i in range(5):
            env=GridEnvironment(25,25,0.22)
            t0=time.time()
            path=astar(env.to_list(),env.start,env.goal)
            ms=(time.time()-t0)*1000
            if path:
                lengths.append(len(path));times.append(ms)
                last_env=env;last_path=path
                print(f'  Run {i+1}: {len(path)} steps, {ms:.2f}ms')
        if last_env:
            plot_path_on_grid(last_env.to_list(),last_path,last_env.start,last_env.goal)
            plot_performance_metrics(lengths,times)
    except ImportError:
        print("Graphs module requires Matplotlib and NumPy.")

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--sim',   action='store_true')
    parser.add_argument('--detect',action='store_true')
    parser.add_argument('--graph', action='store_true')
    parser.add_argument('--all',   action='store_true')
    args=parser.parse_args()
    
    # Ensure output dirs exist
    os.makedirs('outputs/screenshots', exist_ok=True)
    os.makedirs('outputs/graphs', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    if args.all or args.graph:  run_graphs()
    if args.all or args.detect: run_detection()
    if args.all or args.sim or not any(vars(args).values()): run_simulation()
