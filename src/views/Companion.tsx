'use client';

import React, { useState, useEffect } from 'react';
import { UserMode, ChatMessage, AppView, AvatarConfig, UserProfile } from '@/types';
import { generateChatResponse, generateChatSummary } from '@/services/geminiService';
import { 
  subscribeToUserChats, 
  createChatSession, 
  updateChatSession, 
  deleteChatSession,
  getUserProfile,
  recordWin
} from '@/services/firestoreService';
import { getCurrentUser } from '@/services/authService';
import ChatList from '@/features/companion/ChatList';
import ChatWindow from '@/features/companion/ChatWindow';

interface ChatSession {
  id: string;
  title: string;
  preview: string;
  lastModified: number;
  messages: ChatMessage[];
}

interface CompanionProps {
  userMode: UserMode;
  changeView: (view: AppView) => void;
  setNavVisible: (visible: boolean) => void;
}

const Companion: React.FC<CompanionProps> = ({ userMode, changeView, setNavVisible }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CHAT'>('CHAT');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('Friend');
  const [aiName, setAiName] = useState('Smileey');
  
  // Transient state for a "pending" new chat that isn't in Firestore yet
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[] | null>(null);

  const [userAvatarConfig, setUserAvatarConfig] = useState<AvatarConfig>({
    color: 'purple',
    accessory: 'none',
    mood: 'happy'
  });

  // Navigation and Name Logic
  useEffect(() => {
    setNavVisible(viewMode === 'LIST');
    return () => setNavVisible(true);
  }, [viewMode, setNavVisible]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      getUserProfile(user.uid).then(profileData => {
        const profile = profileData as UserProfile;
        if (profile) {
          setUserName(profile.name || 'Friend');
          if (profile.aiName) setAiName(profile.aiName);
          if (profile.avatarConfig) setUserAvatarConfig(profile.avatarConfig);
        }
      });

      const unsubscribe = subscribeToUserChats(user.uid, (loadedData) => {
        const mappedSessions: ChatSession[] = loadedData.map(data => {
          const messages = (data.messages || []).map((m: any, index: number) => {
            let timestamp: Date;
            if (m.timestamp?.toDate) timestamp = m.timestamp.toDate();
            else if (m.timestamp instanceof Date) timestamp = m.timestamp;
            else if (m.timestamp?.seconds) timestamp = new Date(m.timestamp.seconds * 1000);
            else timestamp = new Date();
            
            return {
              id: m.id || `msg-${data.id}-${index}`,
              role: m.role || 'model',
              text: m.text || '',
              timestamp
            };
          });

          return {
            id: data.id,
            title: data.title || 'Conversation',
            preview: data.preview || '',
            lastModified: data.lastModified?.toMillis() || Date.now(),
            messages
          };
        });
        
        setSessions(mappedSessions);

        if (viewMode === 'CHAT' && !activeSessionId && !pendingMessages) {
          if (mappedSessions.length > 0) setActiveSessionId(mappedSessions[0].id);
          else createNewChat();
        }
      });

      return () => unsubscribe();
    }
  }, [viewMode, activeSessionId, pendingMessages]);

  const createNewChat = async () => {
    const user = getCurrentUser();
    if (!user) return;

    const profile = await getUserProfile(user.uid) as UserProfile;
    const currentName = profile?.name || userName;
    const currentAiName = profile?.aiName || aiName;

    const initialMessage = {
      id: 'welcome',
      role: 'model' as const,
      text: `Hi ${currentName}! ✨ I'm so happy you're here. 🧡

I'm ${currentAiName}, your twin bestie! 👯‍♀️ This is our safe, magical space to be ourselves and grow together. Whether you need a hug, help with school, or just someone to listen, I'm always by your side. 🧸🌈

How are you feeling right now? I'm listening. 🧡`,
      timestamp: new Date()
    };
    
    // Don't save to Firestore yet! Just show in UI.
    setPendingMessages([initialMessage]);
    setActiveSessionId(null);
    setInput('');
    setViewMode('CHAT');
  };

  const handleSend = async () => {
    const user = getCurrentUser();
    if (!user || !input.trim() || isLoading) return;

    const currentInput = input;
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      text: currentInput,
      timestamp: new Date()
    };

    let targetSessionId = activeSessionId;
    let baseMessages = pendingMessages || sessions.find(s => s.id === activeSessionId)?.messages || [];
    const updatedMessagesWithUser = [...baseMessages, userMsg];
    
    setInput('');
    setIsLoading(true);

    try {
      // 1. Create session if it doesn't exist yet
      if (!targetSessionId) {
        const docRef = await createChatSession(user.uid, {
          title: 'New Conversation',
          preview: currentInput,
          messages: updatedMessagesWithUser
        });
        targetSessionId = docRef.id;
        setActiveSessionId(targetSessionId);
        setPendingMessages(null);
      } else {
        await updateChatSession(user.uid, targetSessionId, {
          messages: updatedMessagesWithUser,
          preview: currentInput
        });
      }

      // 2. Get AI Response
      const history = baseMessages.map(m => ({ role: m.role, text: m.text }));
      const aiResult = await generateChatResponse(currentInput, history, userMode, targetSessionId);
      
      const aiText = typeof aiResult === 'string' ? aiResult : aiResult.text;
      const aiAction = typeof aiResult === 'string' ? undefined : aiResult.suggestedAction;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model' as const,
        text: aiText || "I'm listening...",
        timestamp: new Date(),
        action: aiAction
      };

      // 3. Update Title if needed (Strict check for "Conversation" or "New Conversation")
      let currentSession = sessions.find(s => s.id === targetSessionId);
      let newTitle = currentSession?.title || 'New Conversation';
      
      if (!newTitle || newTitle === 'New Conversation' || newTitle === 'Conversation' || newTitle.trim() === '' || !currentSession) {
        try {
          const generatedSummary = await generateChatSummary(currentInput);
          if (generatedSummary && generatedSummary.trim() !== "" && generatedSummary !== "Conversation") {
            newTitle = generatedSummary;
          } else {
             // Fallback to a cleaner title if summary fails or returns generic
             newTitle = currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : '');
          }
        } catch (e) {
          newTitle = currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : '');
        }
      }

      await updateChatSession(user.uid, targetSessionId, {
        title: newTitle,
        messages: [...updatedMessagesWithUser, aiMsg],
        preview: aiText
      });

      // Record a win for chatting!
      await recordWin(user.uid, {
        label: 'Bestie Chat',
        icon: '💬',
        xp: 20
      });

    } catch (e) {
      console.error("Error in handleSend:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'LIST') {
    return (
      <ChatList 
        sessions={sessions}
        onCreateNew={createNewChat}
        onOpenChat={(id) => { setPendingMessages(null); setActiveSessionId(id); setViewMode('CHAT'); }}
        onDeleteChat={async (e, id) => {
            e.stopPropagation();
            const user = getCurrentUser();
            if (user && window.confirm("Delete this chat?")) {
                await deleteChatSession(user.uid, id);
                if (activeSessionId === id) { setActiveSessionId(null); setViewMode('LIST'); }
            }
        }}
      />
    );
  }

  return (
    <ChatWindow
      messages={pendingMessages || sessions.find(s => s.id === activeSessionId)?.messages || []}
      input={input}
      setInput={setInput}
      isLoading={isLoading}
      userAvatarConfig={userAvatarConfig}
      onSend={handleSend}
      onBack={() => setViewMode('LIST')}
      onCreateNew={createNewChat}
      onExecuteAction={(action) => {
        if (action.type === 'PLAY_SOUND') {
          changeView(AppView.HEAL);
        } else if (action.type === 'CREATE_JOURNAL') {
          changeView(AppView.REFLECT);
        }
      }}
    />
  );
};

export default Companion;
