'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Loader2, ArrowUp, Plus, Mic, ChevronDown, Sparkles } from 'lucide-react';
import { ChatMessage, AvatarConfig } from '@/types';
import DigitalAvatar from '@/components/ui/DigitalAvatar';

interface ChatWindowProps {
  messages: ChatMessage[];
  input: string;
  setInput: (s: string) => void;
  isLoading: boolean;
  userAvatarConfig: AvatarConfig;
  onSend: () => void;
  onBack: () => void;
  onCreateNew: () => void;
  onExecuteAction?: (action: any) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, input, setInput, isLoading, userAvatarConfig, onSend, onBack, onCreateNew, onExecuteAction 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const nextHeight = Math.min(textarea.scrollHeight, 80);
      textarea.style.height = `${nextHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const formatMessageText = (text: string) => {
    return text.replace(/\*/g, '').trim();
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-transparent overflow-hidden font-sans">
      
      {/* CRYSTAL CLEAR HEADER - ULTRA TIGHT */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-50 pointer-events-none">
          <button 
            onClick={onBack}
            className="w-8 h-8 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-xl pointer-events-auto"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
          
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-1 bg-white/20 backdrop-blur-3xl border border-white/30 px-3 py-1 rounded-full text-white active:scale-95 transition-all shadow-xl group pointer-events-auto"
          >
             <Plus size={12} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
             <span className="text-[9px] font-bold uppercase tracking-[0.05em]">New Chat</span>
          </button>
      </div>

      {/* MESSAGE STREAM - HIGH DENSITY */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar space-y-2 px-4 pt-16 pb-8 scroll-smooth"
      >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className="flex flex-col w-full animate-fade-in">
                {/* INCREASED AVATAR SIZE */}
                <div className={`flex items-center mb-0.5 ${isUser ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                  {isUser ? (
                    <div className="w-[30px] h-[30px]">
                      <DigitalAvatar 
                        config={userAvatarConfig} 
                        mini 
                        forceAnimate 
                        className="w-full h-full" 
                      />
                    </div>
                  ) : (
                    <Sparkles size={30} className="text-white" strokeWidth={2.5} fill="white" fillOpacity="0.2" />
                  )}
                </div>

                <div className={`
                  px-4 py-3 rounded-[18px] text-[14px] leading-[1.35] font-semibold break-words w-full whitespace-pre-wrap tracking-[-0.01em] border shadow-sm
                  ${isUser 
                    ? 'bg-slate-900 text-white border-white/10 rounded-tr-none' 
                    : 'bg-white text-slate-900 border-white/40 rounded-tl-none'}
                `}>
                  {formatMessageText(msg.text)}

                  {msg.action && !isUser && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                       {msg.action.type === 'PLAY_SOUND' && (
                         <button 
                           onClick={() => onExecuteAction?.(msg.action)}
                           className="flex items-center gap-3 bg-pink-50 text-[#EC4899] px-4 py-2.5 rounded-xl active:scale-95 transition-all font-bold text-[13px] hover:bg-pink-100"
                         >
                            <div className="w-8 h-8 rounded-lg bg-[#EC4899] text-white flex items-center justify-center">
                               <Plus size={16} fill="white" />
                            </div>
                            <span>Play "{msg.action.data.title}"</span>
                         </button>
                       )}
                       {msg.action.type === 'CREATE_JOURNAL' && (
                         <button 
                           onClick={() => onExecuteAction?.(msg.action)}
                           className="flex items-center gap-3 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl active:scale-95 transition-all font-bold text-[13px] hover:bg-indigo-100"
                         >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                               <Sparkles size={16} fill="white" />
                            </div>
                            <span>Save to Reflection Journal</span>
                         </button>
                       )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex flex-col items-start w-full">
               <div className="flex items-center mb-0.5 pl-1">
                  <Loader2 size={18} className="animate-spin text-white/50" strokeWidth={2.5} />
               </div>
               <div className="h-8 w-20 bg-white/15 rounded-[18px] rounded-tl-none border border-white/10 animate-pulse" />
            </div>
          )}
      </div>

      {/* SCROLL BUTTON */}
      {showScrollButton && (
        <button 
          onClick={() => scrollToBottom()}
          className="absolute bottom-20 right-4 w-8 h-8 bg-white border border-white/60 rounded-full flex items-center justify-center text-slate-900 shadow-2xl animate-bounce z-40 active:scale-90"
        >
          <ChevronDown size={16} strokeWidth={3} />
        </button>
      )}

      {/* Premium Spacious Input Dock */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl rounded-t-[32px] pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-50 border-t border-slate-50">
         <div className="max-w-md mx-auto flex flex-col gap-3">
            
            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Your AI Bestie"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none text-slate-900 placeholder-slate-400 text-[16px] font-semibold resize-none p-0 no-scrollbar min-h-[24px] leading-snug tracking-tight appearance-none"
                    rows={1}
                />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-slate-600">
                 <button className="active:scale-90 transition-transform hover:text-slate-900">
                    <Plus size={24} strokeWidth={2.5} />
                 </button>
                 <button className="active:scale-90 transition-transform hover:text-slate-900">
                    <Mic size={24} strokeWidth={2.5} />
                 </button>
              </div>

              <button 
                onClick={onSend}
                disabled={isLoading || !input.trim()}
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0
                  ${!input.trim() 
                    ? 'bg-slate-100 text-slate-300' 
                    : 'bg-slate-900 text-white shadow-xl active:scale-90 border border-white/10'}
                `}
              >
                <ArrowUp size={22} strokeWidth={3} />
              </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ChatWindow;
