# python/main.py
import argparse
import os
import sys

# Add current dir to path to ensure modules are found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_simulation():
    """Runs the interactive Pygame simulation."""
    print("\n[1/3] INITIALIZING VIRTUAL SIMULATION...")
    try:
        from simulation.main_sim import run_simulation as sim
        sim(save_path='outputs/screenshots/final_sim_run.png')
    except ImportError as e:
        print(f"  ERROR: Simulation module requires Pygame. {e}")
        print("  FIX: Run 'pip install pygame' to enable interactive simulation.")

def run_detection():
    """Runs the YOLOv8 perception layer analysis."""
    print("\n[2/3] RUNNING PERCEPTION LAYER ANALYSIS...")
    try:
        from src.yolo_detect import ObjectDetector
        d = ObjectDetector('yolov8n')
        img = 'data/test_image.jpg'
        
        if not os.path.exists(img):
            print(f"  WARNING: Image not found at {img}. Skipping detection.")
            print("  TIP: Place a road/street image at data/test_image.jpg to test perception.")
            return
            
        _, dets = d.detect(img)
        print(f"  SUCCESS: Detected {len(dets)} objects in scene.")
        for det in dets:
            print(f"    - {det['class']} ({det['confidence']}) -> Action: {det['action']}")
    except ImportError as e:
        print(f"  ERROR: Detection module requires OpenCV and Ultralytics. {e}")
        print("  FIX: Run 'pip install opencv-python ultralytics' to enable perception.")

def run_graphs():
    """Generates performance analytics and path graphs."""
    print("\n[3/3] GENERATING PERFORMANCE ANALYTICS...")
    import time
    try:
        from simulation.grid_env import GridEnvironment
        from src.astar import astar
        from src.graph_results import plot_path_on_grid, plot_performance_metrics
        
        lengths, times = [], []
        last_env = None
        last_path = None
        
        print("  Running 5-trial performance benchmark...")
        for i in range(5):
            env = GridEnvironment(25, 25, 0.22)
            t0 = time.time()
            path = astar(env.to_list(), env.start, env.goal)
            ms = (time.time() - t0) * 1000
            
            if path:
                lengths.append(len(path))
                times.append(ms)
                last_env = env
                last_path = path
                print(f"    Trial {i+1}: {len(path)} steps | {ms:.2f}ms")
        
        if last_env and last_path:
            plot_path_on_grid(last_env.to_list(), last_path, last_env.start, last_env.goal, 
                             save_path='outputs/graphs/path_graph.png')
            plot_performance_metrics(lengths, times, 
                                    save_path='outputs/graphs/performance.png')
            print("  SUCCESS: Analytics reports saved to outputs/graphs/")
    except ImportError as e:
        print(f"  ERROR: Graphs module requires Matplotlib and NumPy. {e}")
        print("  FIX: Run 'pip install matplotlib numpy' to enable analytics.")

def main():
    parser = argparse.ArgumentParser(description="AeroNav AI - End-to-End Navigation Pipeline")
    parser.add_argument('--sim',    action='store_true', help="Run Pygame simulation")
    parser.add_argument('--detect', action='store_true', help="Run YOLO perception analysis")
    parser.add_argument('--graph',  action='store_true', help="Generate performance graphs")
    parser.add_argument('--all',    action='store_true', help="Run full pipeline")
    
    args = parser.parse_args()
    
    # Ensure output structure exists
    os.makedirs('outputs/screenshots', exist_ok=True)
    os.makedirs('outputs/graphs', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Default to simulation if no args provided
    if not any(vars(args).values()):
        args.sim = True

    if args.all or args.sim:
        run_simulation()
    
    if args.all or args.detect:
        run_detection()
        
    if args.all or args.graph:
        run_graphs()

if __name__ == '__main__':
    main()
