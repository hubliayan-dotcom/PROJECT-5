import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GridSimulation } from './GridSimulation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Navigation, Eye, BarChart3, Settings, Shield, Cpu, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const mockPerformanceData = [
  { name: 'Run 1', steps: 38, time: 0.82 },
  { name: 'Run 2', steps: 41, time: 0.74 },
  { name: 'Run 3', steps: 35, time: 0.91 },
  { name: 'Run 4', steps: 44, time: 0.68 },
  { name: 'Run 5', steps: 39, time: 0.77 },
];

export const NavigationDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 p-4 md:p-8 font-sans selection:bg-sky-500/30">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
              <Navigation className="text-sky-400" size={24} />
            </div>
            <Badge variant="outline" className="bg-sky-500/5 text-sky-400 border-sky-500/20 px-3 py-0.5 uppercase tracking-widest text-[10px] font-bold">
              System v1.0.4
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-2 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            AeroNav AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-md text-lg"
          >
            Autonomous navigation system with real-time path planning and perception analysis.
          </motion.p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Compute Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-emerald-400">Operational</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <Tabs defaultValue="navigation" className="space-y-8">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl h-auto">
            <TabsTrigger value="navigation" className="gap-2 px-6 py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-sky-400">
              <Navigation size={16} /> Navigation
            </TabsTrigger>
            <TabsTrigger value="perception" className="gap-2 px-6 py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-sky-400">
              <Eye size={16} /> Perception
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 px-6 py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-sky-400">
              <BarChart3 size={16} /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="navigation" className="mt-0 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Cpu size={20} className="text-sky-400" />
                    Real-Time Simulation
                  </CardTitle>
                  <CardDescription className="text-zinc-500">
                    A* Pathfinding algorithm executing on a 25x25 grid environment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GridSimulation />
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="bg-zinc-900/40 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Shield size={18} className="text-sky-400" />
                      System Constraints
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Algorithm</div>
                      <div className="text-sm font-medium">A* (A-Star) Search</div>
                      <div className="text-xs text-zinc-500 mt-1">Heuristic: Manhattan Distance</div>
                    </div>
                    <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Environment</div>
                      <div className="text-sm font-medium">2D Grid Map</div>
                      <div className="text-xs text-zinc-500 mt-1">Density: 22% Obstacles</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900/40 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Zap size={18} className="text-sky-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-xs py-6">
                      Export Path
                    </Button>
                    <Button variant="outline" className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-xs py-6">
                      Save Map
                    </Button>
                    <Button variant="outline" className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-xs py-6">
                      Calibrate
                    </Button>
                    <Button variant="outline" className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 text-xs py-6">
                      Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="perception" className="mt-0 outline-none">
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <CardTitle>Perception Layer Analysis</CardTitle>
                <CardDescription>Object detection and navigation decision mapping.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl m-6">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-zinc-800/50 rounded-full w-fit mx-auto">
                    <Eye size={32} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 max-w-xs">
                    Perception layer simulation requires image input. Upload a scene to analyze navigation threats.
                  </p>
                  <Button variant="outline">Upload Scene</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-zinc-900/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>Path Length Analysis</CardTitle>
                  <CardDescription>Total steps taken per simulation run.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#38bdf8' }}
                      />
                      <Bar dataKey="steps" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/40 border-zinc-800">
                <CardHeader>
                  <CardTitle>Computation Time</CardTitle>
                  <CardDescription>Algorithm execution time in milliseconds.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#f43f5e' }}
                      />
                      <Line type="monotone" dataKey="time" stroke="#f43f5e" strokeWidth={2} dot={{ fill: '#f43f5e' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs font-mono uppercase tracking-widest">
        <div>© 2026 AeroNav Systems International</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">API Reference</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};
