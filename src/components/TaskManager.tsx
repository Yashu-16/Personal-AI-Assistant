
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskManagerProps {
  newTask?: string;
}

const TaskManager = ({ newTask }: TaskManagerProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('assistantTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    // Add new task from chat
    if (newTask && newTask.trim()) {
      addTask(newTask);
    }
  }, [newTask]);

  useEffect(() => {
    // Save tasks to localStorage
    localStorage.setItem('assistantTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText: string) => {
    const priority = determinePriority(taskText);
    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date(),
      priority
    };
    
    setTasks(prev => [newTaskObj, ...prev]);
    setInputValue('');
    
    toast({
      title: "Task Added",
      description: `Added "${taskText}" with ${priority} priority`,
    });
  };

  const determinePriority = (text: string): 'low' | 'medium' | 'high' => {
    const urgentWords = /urgent|asap|immediately|emergency|critical/i;
    const importantWords = /important|deadline|meeting|appointment|call/i;
    
    if (urgentWords.test(text)) return 'high';
    if (importantWords.test(text)) return 'medium';
    return 'low';
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your list",
    });
  };

  const handleAddTask = () => {
    if (inputValue.trim()) {
      addTask(inputValue.trim());
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle size={14} />;
      case 'medium': return <Calendar size={14} />;
      default: return null;
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button onClick={handleAddTask} disabled={!inputValue.trim()}>
            <Plus size={16} />
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Pending Tasks ({pendingTasks.length})
          </h3>
          
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending tasks! 🎉</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1">
                  <p className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {task.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))
          )}

          {completedTasks.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700 mt-6">
                Completed Tasks ({completedTasks.length})
              </h3>
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg opacity-75">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <p className="line-through text-gray-500">{task.text}</p>
                    <span className="text-xs text-gray-400">
                      Completed on {task.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskManager;
