
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/ChatInterface';
import TaskManager from '@/components/TaskManager';
import MemoryPanel from '@/components/MemoryPanel';
import StatsOverview from '@/components/StatsOverview';
import { Bot, CheckSquare, Brain, BarChart3, Smartphone, Monitor } from 'lucide-react';

const Index = () => {
  const [extractedTask, setExtractedTask] = useState<string>('');

  const handleTaskExtraction = (task: string) => {
    setExtractedTask(task);
    // Clear after a short delay to allow TaskManager to process it
    setTimeout(() => setExtractedTask(''), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <Bot size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personal AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for solving problems, managing tasks, and remembering everything important. 
            Works seamlessly across all your devices.
          </p>
          
          {/* Cross-platform indicators */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Smartphone size={16} />
              <span>iPhone Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Monitor size={16} />
              <span>Windows Compatible</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot size={16} />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare size={16} />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Brain size={16} />
              <span className="hidden sm:inline">Memory</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold">AI Assistant Chat</h2>
              </div>
              <ChatInterface onTaskExtracted={handleTaskExtraction} />
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="text-green-500" size={24} />
              <h2 className="text-xl font-semibold">Task Management</h2>
            </div>
            <TaskManager newTask={extractedTask} />
          </TabsContent>

          <TabsContent value="memory" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-purple-500" size={24} />
              <h2 className="text-xl font-semibold">Memory & Knowledge</h2>
            </div>
            <MemoryPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-orange-500" size={24} />
              <h2 className="text-xl font-semibold">Productivity Analytics</h2>
            </div>
            <Card className="p-6">
              <div className="text-center py-12">
                <BarChart3 size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Advanced productivity insights, task completion trends, and personalized recommendations 
                  will be available in the next update.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Your personal AI assistant - Always learning, always helping</p>
          <p className="mt-1">Data is stored locally on your device for privacy</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
