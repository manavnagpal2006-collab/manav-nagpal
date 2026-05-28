import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles, Smile, Trash2, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, BeautyProfile } from '../types';

interface BeautyChatbotProps {
  userProfile: BeautyProfile | null;
}

const PRESET_CHIPS = [
  { text: 'Which lipstick suits wheatish skin?', label: 'Wheatish Tone Match' },
  { text: 'Best nude lipstick for college everyday?', label: 'Everyday College Nudes' },
  { text: 'Lipstick match for wearing a classic black dress?', label: 'Black Dress Evening' },
  { text: 'What is a similar shade/alternative to MAC Ruby Woo?', label: 'Ruby Woo Alternatives' }
];

// Elegant Markdown text formatter to handle bolding and bullets beautifully
function ChatMessageFormatter({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        // Bullet point check
        if (line.trim().startsWith('*')) {
          const content = line.trim().substring(1).trim();
          return (
            <li key={idx} className="list-disc list-inside ml-2 pl-1">
              <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
            </li>
          );
        }
        // Standard line with bolding check
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
        );
      })}
    </div>
  );
}

function formatBold(str: string): string {
  // Simple regex replacement for **text** -> <strong>text</strong>
  return str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function BeautyChatbot({ userProfile }: BeautyChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello, style maven! 🌸 I am **Aria Shade**, your personal AI Beauty Advisor. 

I can guide you on:
* Which tones suit your natural complexion.
* Creating stunning looks for parties, college, or wedding celebrations.
* Unearthing affordable alternatives to prestige collections.

How can I help you express your confidence today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setIsTyping(false);
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: 'My apologies! My cosmetic database seems to have brief connectivity ripples. Please try sending your styled inquiry again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const clearChatHistory = () => {
    if (window.confirm('Delete all messages from Aria Shade? This will clean up your current session.')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'Hello again! Ready to build another exquisite color narrative? How can I help you with lipstick matching styles today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 w-full pb-10">
      
      {/* ADVISOR BANNER */}
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs text-[#E25B45] uppercase tracking-widest font-mono font-semibold">Prestige Makeup Consultant</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1515]">AI Beauty Assistant</h2>
        <p className="text-xs sm:text-sm text-[#5E4D4A] max-w-md mx-auto font-light">
          Ask our lead beauty consultant anything! Uncover complementary shades for wedding dresses, skin shade guides, or matches.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#F0E6E3] overflow-hidden shadow-xl flex flex-col h-[600px]">
        
        {/* CHAT HEADER GAUGE */}
        <div className="px-6 py-4 border-b border-[#F5EAE7] bg-[#FAF6F5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-[#9C3A3C] rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white">
              <span className="font-serif font-bold text-base leading-none">A</span>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
            </div>

            <div>
              <span className="text-sm font-bold text-[#1A1515] block">Aria Shade</span>
              <span className="text-[10px] text-emerald-600 block flex items-center space-x-1 font-mono">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Beauty Specialist Online</span>
              </span>
            </div>
          </div>

          <button
            id="clear-chat-btn"
            onClick={clearChatHistory}
            className="p-2 rounded-full text-[#8A6E68] hover:text-[#9C3A3C] hover:bg-[#FAF0EE] transition-all cursor-pointer"
            title="Clean Chat logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* FEED / CONVERSATION CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-radial bg-linear-to-b from-white to-[#FAF6F5]">
          
          {messages.map((m) => {
            const isAssis = m.sender === 'assistant';
            return (
              <div 
                key={m.id} 
                className={`flex items-start space-x-3 max-w-[85%] ${
                  isAssis ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse space-x-reverse'
                }`}
              >
                {/* Chat Bubble Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 shadow-2xs ${
                  isAssis 
                    ? 'bg-[#9C3A3C] border-[#9C3A3C] text-white font-serif text-xs font-bold' 
                    : 'bg-[#E5D5D1] border-[#D5C2BE] text-[#5C4A47]'
                }`}>
                  {isAssis ? 'A' : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Actual Bubble Box */}
                <div className={`p-4 rounded-3xl shadow-3xs ${
                  isAssis 
                    ? 'bg-white rounded-tl-xs border border-[#F0E6E3] text-[#1A1515]' 
                    : 'bg-[#D11C29] rounded-tr-xs text-white'
                }`}>
                  <ChatMessageFormatter text={m.text} />
                  <span className={`block text-[8px] font-mono mt-2 text-right ${isAssis ? 'text-[#8A6E68]' : 'text-rose-100'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing simulation bubble */}
          {isTyping && (
            <div className="flex items-start space-x-3 self-start mr-auto">
              <div className="w-8 h-8 rounded-full bg-[#9C3A3C] border-2 border-white flex items-center justify-center text-white font-serif text-xs font-bold shadow-2xs">
                A
              </div>

              <div className="p-4 bg-white rounded-3xl rounded-tl-xs border border-[#F0E6E3] flex items-center justify-center space-x-1.5 shadow-2xs h-11 w-16">
                <span className="w-1.5 h-1.5 bg-[#8A6E68] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#8A6E68] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#8A6E68] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* INTEGRATED SUGGESTION CHIPS DISPLAY */}
        <div className="px-6 py-2 bg-[#FAF6F5] border-t border-[#F5EAE7]">
          <div className="flex items-center space-x-2 overflow-x-auto py-1.5 scrollbar-none pr-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold shrink-0 text-[#8A6E68] flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#E25B45]" />
              <span>Ask:</span>
            </span>
            {PRESET_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                id={`preset-chip-btn-${idx}`}
                onClick={() => handleSendMessage(chip.text)}
                className="shrink-0 px-3.5 py-1.5 bg-white text-[10px] font-medium text-[#c42023] hover:text-white border border-[#E5D5D1] hover:bg-[#1A1515] hover:border-[#1A1515] rounded-full cursor-pointer transition-all pr-3"
              >
                <span>{chip.label}</span>
                <ArrowRight className="w-2.5 h-2.5 inline-block ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* INPUT SEND WIDGET */}
        <div className="p-4 bg-white border-t border-[#F5EAE7] flex items-center space-x-3">
          <input
            type="text"
            value={inputVal}
            id="chat-user-input"
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
            placeholder="Introduce your questions to Aria (e.g. Best nude for college?)..."
            className="flex-1 bg-[#FAF6F5] border border-[#E5D5D1] rounded-full px-5 py-3 text-xs focus:ring-1 focus:ring-[#9C3A3C] focus:outline-none placeholder-[#A38A85] text-[#1A1515] font-sans"
          />

          <button
            id="chat-send-submit-btn"
            onClick={() => handleSendMessage(inputVal)}
            disabled={!inputVal.trim() || isTyping}
            className="p-3 bg-[#1A1515] hover:bg-[#9C3A3C] text-white rounded-full transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
