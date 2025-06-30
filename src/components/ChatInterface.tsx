
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onTaskExtracted?: (task: string) => void;
}

const ChatInterface = ({ onTaskExtracted }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your personal assistant. I can help you solve problems, manage tasks, and remember important information. What can I help you with today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Task detection patterns
    const taskPatterns = [
      /need to|have to|should|must|remind me to|don't forget to/i,
      /task|todo|assignment|deadline|meeting|appointment/i
    ];
    
    if (taskPatterns.some(pattern => pattern.test(userMessage))) {
      onTaskExtracted?.(userMessage);
    }

    // Response generation based on message content
    if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      return "I've noted that task for you! You can see all your tasks in the Tasks section. Is there anything specific about this task you'd like me to remember?";
    }
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return "I'm here to help you solve that problem! Can you tell me more details about what you're facing? I'll break it down into manageable steps.";
    }
    
    if (lowerMessage.includes('remember') || lowerMessage.includes('note')) {
      return "I'll remember that information for you. I keep track of our conversations and important details you share with me.";
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return "I can help you organize your schedule! While I don't have calendar integration yet, I can help you plan and remember important dates and deadlines.";
    }

    // Default responses
    const responses = [
      "That's interesting! Tell me more about that.",
      "I understand. How can I help you with this?",
      "Got it! What would you like to do next?",
      "Thanks for sharing that with me. I'll remember this information.",
      "That makes sense. Is there a specific way you'd like me to assist with this?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save to memory
    const memory = JSON.parse(localStorage.getItem('assistantMemory') || '[]');
    memory.push({
      type: 'conversation',
      content: inputValue,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('assistantMemory', JSON.stringify(memory));

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[500px] p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] ${
              message.sender === 'user' ? 'text-right' : ''
            }`}>
              <div className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.text}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything or tell me about a task..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
          <Send size={16} />
        </Button>
      </div>
    </Card>
  );
};

export default ChatInterface;
