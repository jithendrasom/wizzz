import React, { useState, useRef, useEffect } from 'react';
import { askLaundryAssistant } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const LaundryAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm Suds, your laundry expert. Ask me anything about stain removal, care labels, or sorting clothes!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const responseText = await askLaundryAssistant(userMessage.text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 p-4 flex items-center text-white">
        <Sparkles className="w-5 h-5 mr-2" />
        <h2 className="font-semibold">Suds - AI Laundry Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 ml-2' : 'bg-indigo-100 mr-2'}`}>
                {msg.sender === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-indigo-600" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                }`}
              >
                {/* Simple markdown-like rendering for bullets */}
                <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                </div>
                <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 ml-10">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a stain..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || isTyping} 
          className="rounded-full px-4"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};
