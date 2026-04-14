import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { astar, Point } from '@/src/lib/astar';
import { GridEnvironment } from '@/src/lib/grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, RotateCcw, Pause, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

interface GridSimulationProps {
  rows?: number;
  cols?: number;
  density?: number;
  onComplete?: (metrics: { steps: number; time: number }) => void;
  onReplan?: () => void;
}

export const GridSimulation: React.FC<GridSimulationProps> = ({
  rows = 25,
  cols = 25,
  density = 0.22,
  onComplete,
  onReplan,
}) => {
  const [env, setEnv] = useState<GridEnvironment>(new GridEnvironment(rows, cols, density));
  const [path, setPath] = useState<Point[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [agentPos, setAgentPos] = useState<Point>([1, 1]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'planning' | 'moving' | 'reached' | 'failed' | 'replanning'>('idle');
  const [dynamicMode, setDynamicMode] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dynamicObstacleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    const newEnv = new GridEnvironment(rows, cols, density);
    setEnv(newEnv);
    setAgentPos(newEnv.start);
    setPath([]);
    setVisited(new Set());
    setStepIndex(0);
    setIsNavigating(false);
    setStatus('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (dynamicObstacleTimerRef.current) clearTimeout(dynamicObstacleTimerRef.current);
  }, [rows, cols, density]);

  const planPath = useCallback((currentStart: Point) => {
    const computedPath = astar(env.grid, currentStart, env.goal);
    if (computedPath.length > 0) {
      setPath(computedPath);
      setStepIndex(0);
      return true;
    }
    return false;
  }, [env]);

  const startNavigation = () => {
    setStatus('planning');
    if (planPath(env.start)) {
      setStatus('moving');
      setIsNavigating(true);
      setVisited(new Set());
    } else {
      setStatus('failed');
    }
  };

  // Dynamic Obstacle Simulation
  useEffect(() => {
    if (dynamicMode && isNavigating && status === 'moving') {
      dynamicObstacleTimerRef.current = setInterval(() => {
        // Randomly place an obstacle in front of the agent with 30% probability
        if (Math.random() < 0.3 && path.length > stepIndex + 2) {
          const targetStep = stepIndex + 2;
          const [r, c] = path[targetStep];
          
          const newGrid = [...env.grid.map(row => [...row])];
          newGrid[r][c] = 1;
          
          setEnv(prev => {
            const next = new GridEnvironment(rows, cols, density);
            next.grid = newGrid;
            next.start = prev.start;
            next.goal = prev.goal;
            return next;
          });

          console.log(`Dynamic obstacle detected at [${r}, ${c}]! Triggering re-plan...`);
          onReplan?.();
        }
      }, 2000);
    } else {
      if (dynamicObstacleTimerRef.current) clearInterval(dynamicObstacleTimerRef.current);
    }
    return () => {
      if (dynamicObstacleTimerRef.current) clearInterval(dynamicObstacleTimerRef.current);
    };
  }, [dynamicMode, isNavigating, status, path, stepIndex, env, onReplan, rows, cols, density]);

  // Movement & Re-planning Logic
  useEffect(() => {
    if (isNavigating && stepIndex < path.length) {
      const nextPos = path[stepIndex];
      const [r, c] = nextPos;

      // Check if next position is now blocked (Dynamic Re-planning)
      if (env.grid[r][c] === 1) {
        console.log("Path blocked! Re-planning...");
        setStatus('replanning');
        setIsNavigating(false);
        
        setTimeout(() => {
          if (planPath(agentPos)) {
            setStatus('moving');
            setIsNavigating(true);
          } else {
            setStatus('failed');
          }
        }, 500);
        return;
      }

      timerRef.current = setTimeout(() => {
        setAgentPos(nextPos);
        setVisited((prev) => new Set(prev).add(nextPos.join(',')));
        setStepIndex((prev) => prev + 1);
      }, 100);
    } else if (isNavigating && stepIndex >= path.length && path.length > 0) {
      setIsNavigating(false);
      setStatus('reached');
      onComplete?.({ steps: path.length + visited.size, time: 0.8 });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isNavigating, stepIndex, path, env, agentPos, onComplete, planPath, visited.size]);

  const getCellColor = (r: number, c: number) => {
    const posKey = `${r},${c}`;
    if (r === env.start[0] && c === env.start[1]) return 'bg-emerald-500';
    if (r === env.goal[0] && c === env.goal[1]) return 'bg-rose-500';
    if (r === agentPos[0] && c === agentPos[1]) return 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] z-10';
    if (env.grid[r][c] === 1) return 'bg-zinc-700';
    if (path.slice(stepIndex).some(p => p[0] === r && p[1] === c)) return 'bg-amber-400/40';
    if (visited.has(posKey)) return 'bg-purple-500/20';
    return 'bg-zinc-900/50';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm gap-4">
        <div className="flex gap-4 items-center">
          <Button 
            variant={status === 'moving' ? 'secondary' : 'default'}
            onClick={status === 'moving' ? () => setIsNavigating(!isNavigating) : startNavigation}
            disabled={status === 'reached' || status === 'failed' || status === 'replanning'}
            className="gap-2 min-w-[140px]"
          >
            {status === 'moving' ? (isNavigating ? <Pause size={18} /> : <Play size={18} />) : <Play size={18} />}
            {status === 'moving' ? (isNavigating ? 'Pause' : 'Resume') : 'Start Navigation'}
          </Button>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw size={18} />
            Reset
          </Button>
        </div>

        <div className="flex items-center space-x-4 bg-zinc-950/50 px-4 py-2 rounded-lg border border-zinc-800">
          <div className="flex items-center space-x-2">
            <Switch 
              id="dynamic-mode" 
              checked={dynamicMode} 
              onCheckedChange={setDynamicMode}
            />
            <Label htmlFor="dynamic-mode" className="text-xs font-mono text-zinc-400 cursor-pointer flex items-center gap-1">
              <RefreshCw size={12} className={dynamicMode ? "animate-spin-slow" : ""} />
              Dynamic Obstacles
            </Label>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <AnimatePresence mode="wait">
            {status === 'reached' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 py-1">
                  <CheckCircle2 size={14} /> Goal Reached
                </Badge>
              </motion.div>
            )}
            {status === 'replanning' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 py-1 animate-pulse">
                  <Zap size={14} /> Re-planning...
                </Badge>
              </motion.div>
            )}
            {status === 'failed' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1 py-1">
                  <AlertCircle size={14} /> No Path Found
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-sm font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
            Steps: <span className="text-zinc-100">{stepIndex}</span> / {path.length || 0}
          </div>
        </div>
      </div>

      <div className="relative group">
        <div 
          className="grid gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            width: 'fit-content'
          }}
        >
          {env.grid.map((row, r) => 
            row.map((_, c) => (
              <div 
                key={`${r}-${c}`}
                className={`w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300 ${getCellColor(r, c)}`}
              />
            ))
          )}
        </div>
        
        {/* Grid Overlay for Dynamic Mode */}
        {dynamicMode && (
          <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 rounded-lg animate-pulse" />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Start Node
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-2 h-2 bg-rose-500 rounded-full" /> Goal Node
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-2 h-2 bg-zinc-700 rounded-sm" /> Obstacle
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-2 h-2 bg-sky-500 rounded-full shadow-[0_0_5px_rgba(14,165,233,0.5)]" /> Agent
        </div>
      </div>
    </div>
  );
};
