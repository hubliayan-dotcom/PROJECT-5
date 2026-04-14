import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { astar, Point } from '@/src/lib/astar';
import { GridEnvironment } from '@/src/lib/grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Pause, CheckCircle2, AlertCircle } from 'lucide-react';

interface GridSimulationProps {
  rows?: number;
  cols?: number;
  density?: number;
  onComplete?: (metrics: { steps: number; time: number }) => void;
}

export const GridSimulation: React.FC<GridSimulationProps> = ({
  rows = 25,
  cols = 25,
  density = 0.22,
  onComplete,
}) => {
  const [env, setEnv] = useState<GridEnvironment>(new GridEnvironment(rows, cols, density));
  const [path, setPath] = useState<Point[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [agentPos, setAgentPos] = useState<Point>([1, 1]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'planning' | 'moving' | 'reached' | 'failed'>('idle');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    const newEnv = new GridEnvironment(rows, cols, density);
    setEnv(newEnv);
    setAgentPos(newEnv.start);
    setPath([]);
    setVisited(new Set());
    setStepIndex(0);
    setIsNavigating(false);
    setStatus('idle');
    if (timerRef.current) clearInterval(timerRef.current);
  }, [rows, cols, density]);

  const startNavigation = () => {
    setStatus('planning');
    const startTime = performance.now();
    const computedPath = astar(env.grid, env.start, env.goal);
    const endTime = performance.now();

    if (computedPath.length > 0) {
      setPath(computedPath);
      setStatus('moving');
      setIsNavigating(true);
      setStepIndex(0);
      setVisited(new Set());
    } else {
      setStatus('failed');
    }
  };

  useEffect(() => {
    if (isNavigating && stepIndex < path.length) {
      timerRef.current = setTimeout(() => {
        const nextPos = path[stepIndex];
        setAgentPos(nextPos);
        setVisited((prev) => new Set(prev).add(nextPos.join(',')));
        setStepIndex((prev) => prev + 1);
      }, 50);
    } else if (isNavigating && stepIndex >= path.length) {
      setIsNavigating(false);
      setStatus('reached');
      onComplete?.({ steps: path.length, time: 0.8 }); // Simulated time for now
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isNavigating, stepIndex, path, onComplete]);

  const getCellColor = (r: number, c: number) => {
    const posKey = `${r},${c}`;
    if (r === env.start[0] && c === env.start[1]) return 'bg-emerald-500';
    if (r === env.goal[0] && c === env.goal[1]) return 'bg-rose-500';
    if (r === agentPos[0] && c === agentPos[1]) return 'bg-sky-500';
    if (env.grid[r][c] === 1) return 'bg-zinc-700';
    if (path.some(p => p[0] === r && p[1] === c)) return 'bg-amber-400/40';
    if (visited.has(posKey)) return 'bg-purple-500/30';
    return 'bg-zinc-900/50';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex gap-4 items-center">
          <Button 
            variant={status === 'moving' ? 'secondary' : 'default'}
            onClick={status === 'moving' ? () => setIsNavigating(!isNavigating) : startNavigation}
            disabled={status === 'reached' || status === 'failed'}
            className="gap-2"
          >
            {status === 'moving' ? (isNavigating ? <Pause size={18} /> : <Play size={18} />) : <Play size={18} />}
            {status === 'moving' ? (isNavigating ? 'Pause' : 'Resume') : 'Start Navigation'}
          </Button>
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw size={18} />
            Reset
          </Button>
        </div>
        
        <div className="flex gap-3 items-center">
          {status === 'reached' && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 py-1">
              <CheckCircle2 size={14} /> Goal Reached
            </Badge>
          )}
          {status === 'failed' && (
            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1 py-1">
              <AlertCircle size={14} /> No Path Found
            </Badge>
          )}
          <div className="text-sm font-mono text-zinc-400">
            Steps: <span className="text-zinc-100">{stepIndex}</span> / {path.length || 0}
          </div>
        </div>
      </div>

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
              className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors duration-200 ${getCellColor(r, c)}`}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Start
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-3 h-3 bg-rose-500 rounded-sm" /> Goal
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-3 h-3 bg-zinc-700 rounded-sm" /> Obstacle
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="w-3 h-3 bg-sky-500 rounded-sm" /> Agent
        </div>
      </div>
    </div>
  );
};
