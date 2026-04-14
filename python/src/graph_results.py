# python/src/graph_results.py
import matplotlib.pyplot as plt
import numpy as np

def plot_path_on_grid(grid, path, start, goal,
                       save_path='outputs/graphs/path_graph.png'):
    fig, ax = plt.subplots(figsize=(10,10))
    fig.patch.set_facecolor('#0F0F1E')
    ax.set_facecolor('#0F0F1E')
    cmap = plt.cm.colors.ListedColormap(['#1a1a2e','#4a4a4a'])
    ax.imshow(np.array(grid), cmap=cmap, interpolation='nearest')
    if path:
        pr=[p[0] for p in path]; pc=[p[1] for p in path]
        ax.plot(pc,pr,'y-',linewidth=2.5,label=f'A* Path ({len(path)} steps)',zorder=3)
        ax.plot(pc,pr,'yo',markersize=4,zorder=4,alpha=0.7)
    ax.plot(start[1],start[0],'go',markersize=15,label='Start',zorder=5)
    ax.plot(goal[1],goal[0],'r*',markersize=15,label='Goal',zorder=5)
    ax.set_title('A* Path Planning Result',color='white',fontsize=14,fontweight='bold')
    ax.tick_params(colors='white')
    ax.legend(facecolor='#1a1a2e',labelcolor='white')
    plt.tight_layout()
    plt.savefig(save_path,dpi=150,bbox_inches='tight',facecolor='#0F0F1E')
    print(f'Path graph saved: {save_path}')
    plt.show()

def plot_performance_metrics(path_lengths, times,
                              save_path='outputs/graphs/performance.png'):
    fig,(ax1,ax2)=plt.subplots(1,2,figsize=(12,5))
    fig.patch.set_facecolor('#0F0F1E')
    runs=[f'Run {i+1}' for i in range(len(path_lengths))]
    for ax,data,color,title,ylabel in [
        (ax1,path_lengths,'#00CFFF','Path Length per Run','Steps'),
        (ax2,times,'#FF6B6B','Computation Time (ms)','ms')]:
        ax.set_facecolor('#1a1a2e')
        bars=ax.bar(runs,data,color=color,edgecolor='white',linewidth=0.5)
        ax.set_title(title,color='white',fontweight='bold')
        ax.set_ylabel(ylabel,color='white')
        ax.tick_params(colors='white')
        for bar,v in zip(bars,data):
            ax.text(bar.get_x()+bar.get_width()/2,bar.get_height()+0.1,
                f'{v:.1f}',ha='center',color='white',fontsize=9)
    plt.suptitle('A* Navigation — Performance Analysis',
                 color='white',fontsize=13,fontweight='bold')
    plt.tight_layout()
    plt.savefig(save_path,dpi=150,bbox_inches='tight',facecolor='#0F0F1E')
    print(f'Performance graph saved: {save_path}')
    plt.show()
