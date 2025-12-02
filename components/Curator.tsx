import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Feather, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { getCuratorResponse } from '../services/geminiService';

export const Curator: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Greetings. I am Alistair, the curator of Ink & Quill. How may I assist you in your bibliophilic pursuits today? Are you looking for a specific volume, or perhaps seeking a recommendation for a quiet evening?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await getCuratorResponse(history, userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I apologize, but I seem to have lost my train of thought. Perhaps try again?"
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "My apologies, I am having trouble accessing the archives at the moment.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading text-[#2C2420]">Consult the Curator</h2>
        <p className="text-[#5C4D45] font-body-serif italic">Alistair is at your service for recommendations and inquiries.</p>
      </div>

      <div className="flex-1 bg-white border border-[#E5DCC5] rounded-sm shadow-inner overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFBF7]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border ${msg.role === 'user' ? 'bg-[#2C2420] border-[#2C2420] ml-3' : 'bg-[#F5F0E6] border-[#E5DCC5] mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-[#FDFBF7]" /> : <Feather className="w-5 h-5 text-[#8B5E3C]" />}
                </div>
                <div className={`p-4 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#2C2420] text-[#FDFBF7]' 
                    : 'bg-[#F5F0E6] text-[#2C2420] border border-[#E5DCC5]'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-[#E5DCC5]">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for a Victorian classic or a book on ancient maps..."
              className="flex-1 p-3 border border-[#D4C5B0] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#8B5E3C] bg-[#FDFBF7] text-[#2C2420] placeholder-[#D4C5B0]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 bg-[#8B5E3C] text-white rounded-sm hover:bg-[#704B30] disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};