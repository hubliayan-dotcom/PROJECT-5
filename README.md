# AeroNav AI - Autonomous Navigation System

![AeroNav AI](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200)

AeroNav AI is a comprehensive autonomous navigation system that integrates path planning, perception, and real-time simulation. This project implements the core logic for an autonomous agent to navigate complex environments while avoiding obstacles.

## Features

- **A* Pathfinding**: Optimized shortest-path algorithm with Manhattan distance heuristic.
- **Real-Time Simulation**: Interactive 2D grid environment built with React and Framer Motion.
- **Perception Layer**: Simulated object detection and decision mapping (YOLOv8 inspired).
- **Analytics Dashboard**: Performance metrics visualization using Recharts.
- **Python Implementation**: Full Python source code included for local deployment.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **UI Components**: shadcn/ui (Radix UI).
- **Visualization**: Recharts (D3-based).
- **Algorithms**: TypeScript (A* Search).
- **Python (Optional)**: Pygame, OpenCV, YOLOv8, Matplotlib.

## Getting Started

### Web Application
The web application is ready to use in the AI Studio preview. It provides an interactive dashboard to test the navigation system.

### Python Project
The `python/` directory contains the source code for a local desktop version of the system.
To run it locally:
1. Install dependencies: `pip install -r python/requirements.txt`
2. Run the simulation: `python python/main.py --sim`

## Project Structure

```
/
├── src/                # Web application source
│   ├── components/     # React components
│   └── lib/            # A* and Grid logic (TS)
├── python/             # Python implementation
│   ├── src/            # Core algorithms
│   └── simulation/     # Pygame environment
└── metadata.json       # App metadata
```

## License
MIT License
