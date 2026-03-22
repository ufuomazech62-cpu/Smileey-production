
export enum UserMode {
  CHILD = 'CHILD',
  TEEN = 'TEEN'
}

export enum AppView {
  LANDING = 'LANDING',
  INTRO = 'INTRO',
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  REFLECT = 'REFLECT',
  HEAL = 'HEAL',
  COMPANION = 'COMPANION'
}

export type AvatarMood = 'happy' | 'sad' | 'calm' | 'excited' | 'tired' | 'neutral';

export interface AvatarConfig {
  color: string;
  accessory: 'none' | 'glasses' | 'headphones' | 'crown' | 'birthday';
  mood: AvatarMood;
}

export interface UserProfile {
  name: string;
  email?: string;
  ageGroup?: string;
  schoolLevel?: string;
  struggles?: string[];
  recentMood?: string;
  primaryGoal?: string;
  onboardingComplete: boolean;
  aiName?: string;
  avatarConfig?: AvatarConfig;
  xp?: number;
  level?: number;
  streak?: number;
  totalWins?: number;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  sentiment?: string;
  aiResponse?: string;
  moodScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  action?: {
    type: 'PLAY_SOUND' | 'CREATE_JOURNAL';
    data: unknown;
  };
}

export interface SoundTrack {
  id: string;
  title: string;
  category: 'Reading' | 'Sleep' | 'Meditation';
  duration: string;
  color: string;
  audioUrl?: string;
}
