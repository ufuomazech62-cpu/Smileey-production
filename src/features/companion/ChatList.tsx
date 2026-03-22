'use client';

import React, { useState } from 'react';
import { Plus, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  lastModified: number;
}

interface ChatListProps {
  sessions: ChatSession[];
  onCreateNew: () => void;
  onOpenChat: (id: string) => void;
  onDeleteChat: (e: React.MouseEvent, id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ sessions, onCreateNew, onOpenChat, onDeleteChat }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden font-sans">
        <div className="pt-8 px-8 flex justify-between items-center mb-8">
           <h1 className="text-[28px] font-bold text-white tracking-[-0.03em]">Chats</h1>
           <button 
             onClick={onCreateNew}
             className="flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full text-white active:scale-95 transition-all shadow-xl group"
           >
              <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[12px] font-black uppercase tracking-widest">New Chat</span>
           </button>
        </div>

        <div className="flex-1 bg-white/95 backdrop-blur-2xl rounded-t-[40px] px-6 pt-10 pb-32 overflow-y-auto no-scrollbar shadow-[0_-12px_40px_rgba(0,0,0,0.06)]">
           <div className="flex items-center justify-between px-2 mb-6">
               <h4 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">Previous Conversations</h4>
           </div>

           <div className="space-y-1">
           {sessions.length === 0 ? (
             <div className="text-center py-20">
               <div className="w-16 h-16 bg-orange-50 rounded-[28px] flex items-center justify-center text-orange-200 mx-auto mb-4">
                  <MessageSquare size={32} />
               </div>
               <p className="font-bold text-slate-300 text-[14px]">Your journey starts here.</p>
             </div>
           ) : (
             sessions.map((session) => (
               <div 
                 key={session.id}
                 onClick={() => onOpenChat(session.id)}
                 className="relative group bg-transparent py-4 px-4 rounded-[20px] flex items-center gap-2 cursor-pointer active:bg-slate-50 transition-all hover:bg-slate-50/50"
               >
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-[16px] text-slate-800 truncate pr-8 tracking-tight mb-0.5">
                      {session.title}
                    </h4>
                    <p className="text-[13px] text-slate-400 truncate font-medium tracking-tight">
                      {session.preview}
                    </p>
                  </div>

                  {/* 3 Dot Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(e, session.id)}
                      className="p-2 text-slate-300 hover:text-slate-500 transition-colors rounded-full"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === session.id && (
                      <div 
                        className="absolute right-0 top-10 bg-white shadow-2xl rounded-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200"
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <button 
                          onClick={(e) => {
                            setActiveMenu(null);
                            onDeleteChat(e, session.id);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-rose-500 hover:bg-rose-50 transition-colors w-full text-left"
                        >
                          <Trash2 size={14} />
                          <span className="text-[12px] font-bold whitespace-nowrap">Delete Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
               </div>
             ))
           )}
           </div>
        </div>
      </div>
  );
};

export default ChatList;
