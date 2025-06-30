
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Plus, Search, Trash2, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemoryItem {
  id: string;
  type: 'note' | 'conversation' | 'preference' | 'fact';
  content: string;
  tags?: string[];
  timestamp: string;
  importance: 'low' | 'medium' | 'high';
}

const MemoryPanel = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load memories from localStorage
    const savedMemories = localStorage.getItem('assistantMemory');
    if (savedMemories) {
      const parsedMemories = JSON.parse(savedMemories);
      setMemories(parsedMemories);
    }
  }, []);

  useEffect(() => {
    // Save memories to localStorage
    localStorage.setItem('assistantMemory', JSON.stringify(memories));
  }, [memories]);

  const addMemory = () => {
    if (!newNote.trim()) return;

    const newMemory: MemoryItem = {
      id: Date.now().toString(),
      type: 'note',
      content: newNote,
      timestamp: new Date().toISOString(),
      importance: 'medium'
    };

    setMemories(prev => [newMemory, ...prev]);
    setNewNote('');
    
    toast({
      title: "Memory Saved",
      description: "I'll remember this information for you",
    });
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
    toast({
      title: "Memory Deleted",
      description: "Memory has been removed",
    });
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return '📝';
      case 'conversation': return '💬';
      case 'preference': return '⚙️';
      case 'fact': return '💡';
      default: return '📄';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-blue-500" size={20} />
          <h2 className="text-lg font-semibold">Memory Bank</h2>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add something for me to remember..."
              className="flex-1 min-h-[80px]"
            />
            <Button onClick={addMemory} disabled={!newNote.trim()}>
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memories..."
              className="pl-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="all">All Types</option>
            <option value="note">Notes</option>
            <option value="conversation">Conversations</option>
            <option value="preference">Preferences</option>
            <option value="fact">Facts</option>
          </select>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain size={48} className="mx-auto mb-2 opacity-50" />
              <p>No memories found</p>
              <p className="text-sm">Start a conversation or add a note!</p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className={`p-3 border-l-4 rounded-r-lg ${getImportanceColor(memory.importance)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(memory.type)}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full capitalize">
                        {memory.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {memory.content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMemory(memory.id)}
                    className="text-red-500 hover:text-red-700 opacity-60 hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> I automatically remember our conversations and can help you recall details later. 
            You can also add specific notes for me to remember about your preferences, important facts, or anything else!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MemoryPanel;
