import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  ExternalLink,
  MapPin,
  HeartHandshake,
  Search,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { PortalView } from '../../types';
import { HeartbeatRecycleLogo } from '../brand/HeartbeatRecycleLogo';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  source?: string;
  action?: {
    label: string;
    view: PortalView;
  };
}

interface AssistanceChatbotProps {
  onNavigate: (view: PortalView) => void;
  isOpenExternal?: boolean;
  onToggleExternal?: (open: boolean) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: "Hello! I am your **MediCycle Assistant**. I'm here to help you donate unused medicines, find affordable generic equivalents, locate partner pharmacies across Bengaluru, or safely dispose of expired medicines.",
    timestamp: 'Just now'
  }
];

const SUGGESTIONS = [
  "How do I donate medicines?",
  "What medicines can be donated?",
  "Find Jan Aushadhi generic savings",
  "Show Bangalore pharmacy map",
  "How do 20% reward points work?",
  "Where to dispose expired medicines?"
];

export const AssistanceChatbot: React.FC<AssistanceChatbotProps> = ({ 
  onNavigate,
  isOpenExternal,
  onToggleExternal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedFull, setIsExpandedFull] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('medicycle_chat_history');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (typeof isOpenExternal === 'boolean') {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const handleToggleOpen = (nextState: boolean) => {
    setIsOpen(nextState);
    if (onToggleExternal) {
      onToggleExternal(nextState);
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Save conversation in session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('medicycle_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages
        })
      });

      let replyText = "";
      let source = "assistant";

      if (response.ok) {
        const data = await response.json();
        replyText = data.reply || "";
        source = data.source || "gemini-3.6-flash";
      }

      if (!replyText) {
        // Fallback responder if server didn't provide text
        replyText = "MediCycle is dedicated to giving medicines a second life. You can visit the **Donor Portal** to list eligible medicines, or the **Patient Portal** to search for free donations and Jan Aushadhi generic alternatives.";
      }

      // Check if we should append a direct portal navigation action button
      let action: { label: string; view: PortalView } | undefined = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('donate') || lower.includes('donor')) {
        action = { label: 'Go to Donor Portal', view: 'donor' };
      } else if (lower.includes('search') || lower.includes('find') || lower.includes('price') || lower.includes('generic')) {
        action = { label: 'Find Medicines (Patient Portal)', view: 'patient' };
      } else if (lower.includes('map') || lower.includes('bangalore') || lower.includes('bengaluru')) {
        action = { label: 'Explore Bangalore Map', view: 'patient' };
      } else if (lower.includes('pharmacy') || lower.includes('stock')) {
        action = { label: 'Pharmacy Portal', view: 'pharmacy' };
      } else if (lower.includes('disposal') || lower.includes('waste')) {
        action = { label: 'Safe Disposal Dashboard', view: 'impact' };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source,
        action
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chat request failed, using client responder:", err);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Thank you for asking. MediCycle accepts unopened blister packs with >60 days before expiration. Visit our **Donor Portal** to donate, or the **Patient Portal** to search for free or generic medicines.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'client-offline-guide',
        action: { label: 'Explore Portals', view: 'patient' }
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      sessionStorage.removeItem('medicycle_chat_history');
    } catch {
      // ignore
    }
  };

  // Helper to render basic markdown bold and bullet items
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Replace **text** with strong
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5">
            <span className="text-emerald-700 font-bold">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Bottom-Right Launcher Icon */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-stone-800 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Need Help? Ask MediCycle</span>
          </div>

          <button
            id="btn-open-chatbot"
            onClick={() => handleToggleOpen(true)}
            className="group relative w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-900/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-hidden ring-4 ring-white"
            aria-label="Open MediCycle Assistance Chatbot"
            title="Open MediCycle Assistance Chatbot"
          >
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-900"></span>
            </div>
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Expanded Chatbot Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-stone-200 overflow-hidden ${
            isExpandedFull
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[88vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <HeartbeatRecycleLogo size="sm" variant="emerald" showPulseDot={true} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white leading-tight">
                    MediCycle Assistant
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded-md">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Giving Medicines a Second Life
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset Chat"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpandedFull(!isExpandedFull)}
                title={isExpandedFull ? "Standard Size" : "Expand Fullscreen"}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors hidden sm:block"
              >
                {isExpandedFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleToggleOpen(false)}
                title="Close Chat"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-stone-50 px-3 py-2 border-b border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-stone-500 font-semibold shrink-0 pl-1">Suggested:</span>
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="text-[11px] font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-emerald-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-100/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                  </div>

                  {/* Optional Context Action Button */}
                  {msg.action && (
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          onNavigate(msg.action!.view);
                          if (!isExpandedFull) {
                            handleToggleOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-colors"
                      >
                        <span>{msg.action.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'}`}>
                    {msg.timestamp}
                    {msg.source && msg.sender === 'bot' && (
                      <span className="ml-1.5 opacity-75">· {msg.source}</span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-stone-500 text-xs">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-stone-500 ml-1">Assistant is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Footer */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about donating, generic savings, or Bangalore map..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-stone-400 text-center mt-2 leading-tight">
              MediCycle Assistant guides platform features. Always consult a licensed doctor for medical treatment.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
