import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { soundManager } from '../services/soundService';
import { ChatMessage } from '../types';
import { Send, User, Sparkles } from 'lucide-react';
import { Chat, GenerateContentResponse } from '@google/genai';

const AstroChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: '你好，我是你的专属星象顾问。无论是关于星盘的困惑，还是生活中的迷茫，我都在这里倾听。你想聊些什么？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session once
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    soundManager.play('message');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: input });
      
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of result) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
           fullText += c.text;
           setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullText } : m));
         }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '星象连接中断，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden mt-4 md:mt-0">
      <div className="bg-white/5 p-4 border-b border-white/10 flex items-center space-x-3">
        <div className="bg-gold-accent/20 p-2 rounded-full">
          <Sparkles className="text-gold-accent" size={20} />
        </div>
        <div>
          <h3 className="text-white font-serif font-bold">星语者 AI</h3>
          <p className="text-xs text-green-400 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> 在线
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 
                 ${msg.role === 'user' ? 'bg-purple-600' : 'bg-gold-accent/20'}`}>
                 {msg.role === 'user' ? <User size={16} className="text-white" /> : <Sparkles size={16} className="text-gold-accent" />}
               </div>
               
               <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed
                 ${msg.role === 'user' 
                   ? 'bg-purple-600 text-white rounded-tr-none' 
                   : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                 }`}>
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400 ml-12">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-gold-accent transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="向星语者提问..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="text-gold-accent hover:text-white disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AstroChat;
