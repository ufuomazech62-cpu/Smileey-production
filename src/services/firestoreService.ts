// Mock firestore service - no Firebase
// All data is stored in localStorage

import { UserProfile } from '@/types';

// Storage keys
const USER_PROFILE_KEY = 'divinity_user_profile';
const CHATS_KEY = 'divinity_user_chats';
const WINS_KEY = 'divinity_user_wins';
const STATS_KEY = 'divinity_user_stats';

/**
 * User Profile Services
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(USER_PROFILE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  if (typeof window === 'undefined') return;
  const existing = await getUserProfile(uid) || {};
  const updated = { ...existing, ...data };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
};

/**
 * Chat Services
 */
export const subscribeToUserChats = (uid: string, callback: (sessions: any[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const loadChats = () => {
    const saved = localStorage.getItem(CHATS_KEY);
    if (saved) {
      try {
        callback(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    callback([]);
  };
  
  loadChats();
  
  // Listen for storage changes
  const handleStorageChange = () => loadChats();
  window.addEventListener('storage', handleStorageChange);
  
  return () => window.removeEventListener('storage', handleStorageChange);
};

export const createChatSession = async (uid: string, initialData: any) => {
  if (typeof window === 'undefined') return { id: 'mock-id' };
  
  const saved = localStorage.getItem(CHATS_KEY);
  const chats = saved ? JSON.parse(saved) : [];
  
  const newChat = {
    id: 'chat-' + Date.now(),
    ...initialData,
    lastModified: { seconds: Date.now() / 1000 }
  };
  
  chats.unshift(newChat);
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  
  return { id: newChat.id };
};

export const updateChatSession = async (uid: string, sessionId: string, data: any) => {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem(CHATS_KEY);
  const chats = saved ? JSON.parse(saved) : [];
  
  const index = chats.findIndex((c: any) => c.id === sessionId);
  if (index !== -1) {
    chats[index] = { ...chats[index], ...data, lastModified: { seconds: Date.now() / 1000 } };
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }
};

export const deleteChatSession = async (uid: string, sessionId: string) => {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem(CHATS_KEY);
  const chats = saved ? JSON.parse(saved) : [];
  const filtered = chats.filter((c: any) => c.id !== sessionId);
  localStorage.setItem(CHATS_KEY, JSON.stringify(filtered));
};

/**
 * Journal/Stats Services
 */
export const addJournalStats = async (uid: string, stats: any) => {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem(STATS_KEY);
  const allStats = saved ? JSON.parse(saved) : [];
  
  allStats.unshift({
    ...stats,
    timestamp: { seconds: Date.now() / 1000 }
  });
  
  localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
};

/**
 * Activity & Growth Services
 */
export const recordWin = async (uid: string, winData: { label: string; icon: string; xp: number }) => {
  if (typeof window === 'undefined') return;
  
  // 1. Add the win to history
  const savedWins = localStorage.getItem(WINS_KEY);
  const wins = savedWins ? JSON.parse(savedWins) : [];
  
  wins.unshift({
    id: 'win-' + Date.now(),
    ...winData,
    timestamp: { seconds: Date.now() / 1000 }
  });
  
  localStorage.setItem(WINS_KEY, JSON.stringify(wins));
  
  // 2. Update user profile XP and Level
  const profile = await getUserProfile(uid);
  if (profile) {
    const currentXP = profile.xp || 0;
    const newXP = currentXP + winData.xp;
    const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1;
    
    await updateUserProfile(uid, {
      xp: newXP,
      level: newLevel,
      totalWins: (profile.totalWins || 0) + 1
    });
  }
};

export const subscribeToWins = (uid: string, callback: (wins: any[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const loadWins = () => {
    const saved = localStorage.getItem(WINS_KEY);
    if (saved) {
      try {
        callback(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    callback([]);
  };
  
  loadWins();
  
  const handleStorageChange = () => loadWins();
  window.addEventListener('storage', handleStorageChange);
  
  return () => window.removeEventListener('storage', handleStorageChange);
};
