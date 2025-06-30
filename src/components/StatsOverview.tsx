
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, MessageSquare, Brain, Target, TrendingUp } from 'lucide-react';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalMemories: number;
  conversationCount: number;
  completionRate: number;
}

const StatsOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    totalMemories: 0,
    conversationCount: 0,
    completionRate: 0
  });

  useEffect(() => {
    const updateStats = () => {
      // Get tasks data
      const savedTasks = localStorage.getItem('assistantTasks');
      const tasks = savedTasks ? JSON.parse(savedTasks) : [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.completed).length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Get memories data
      const savedMemories = localStorage.getItem('assistantMemory');
      const memories = savedMemories ? JSON.parse(savedMemories) : [];
      const totalMemories = memories.length;
      const conversationCount = memories.filter((memory: any) => memory.type === 'conversation').length;

      setStats({
        totalTasks,
        completedTasks,
        totalMemories,
        conversationCount,
        completionRate
      });
    };

    updateStats();
    
    // Update stats every 5 seconds to reflect changes
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Tasks Completed',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: Target,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Conversations',
      value: stats.conversationCount.toString(),
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Memories Stored',
      value: stats.totalMemories.toString(),
      icon: Brain,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
