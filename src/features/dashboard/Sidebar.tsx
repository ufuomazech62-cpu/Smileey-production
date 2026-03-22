'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  Trash2,
  Heart,
  User,
  Info,
  Mic,
  X,
  Play,
  Pause,
  Mail,
  AlertTriangle,
  Sparkles,
  Sliders,
  Globe,
  Volume2,
  Send,
  CheckCircle2,
  Sun
} from 'lucide-react';
import { AvatarConfig, UserProfile } from '@/types';
import DigitalAvatar from '@/components/ui/DigitalAvatar';
import Logo from '@/components/ui/Logo';
import { getCurrentUser } from '@/services/authService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

type SettingsView = 
  | 'MAIN' 
  | 'AVATAR_CUSTOMIZE' 
  | 'NOTIFICATIONS' 
  | 'PREFERENCES' 
  | 'ABOUT' 
  | 'FEEDBACK' 
  | 'PRIVACY' 
  | 'TERMS';

type ThemeOption = 'sunset' | 'ocean' | 'garden' | 'lavender';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSignOut }) => {
  const [currentView, setCurrentView] = useState<SettingsView>('MAIN');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const [aiName, setAiName] = useState('Bestie');
  const [tempName, setTempName] = useState('Bestie');
  const [selectedVoice, setSelectedVoice] = useState('Nova');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [volume, setVolume] = useState(75);
  const [userEmail, setUserEmail] = useState("");
  
  const [userAvatarConfig, setUserAvatarConfig] = useState<AvatarConfig>({
    color: 'purple',
    accessory: 'none',
    mood: 'happy'
  });
  
  const [theme, setTheme] = useState<ThemeOption>('sunset');
  const [tempAvatarConfig, setTempAvatarConfig] = useState<AvatarConfig>(userAvatarConfig);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [notifications, setNotifications] = useState({
    morning: true,
    ai: true,
    sound: false
  });
  
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Mock mode - load from localStorage
      const savedUser = localStorage.getItem('divinity_mock_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setUserEmail(user.email || 'user@example.com');
        } catch (e) {}
      }
      
      const savedProfile = localStorage.getItem('divinity_user_profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile) as UserProfile;
          if (profile.avatarConfig) {
            setUserAvatarConfig(profile.avatarConfig);
            setTempAvatarConfig(profile.avatarConfig);
          }
          if (profile.aiName) {
            setAiName(profile.aiName);
            setTempName(profile.aiName);
          }
        } catch (e) { console.error(e); }
      }
    };

    if (isOpen) {
      fetchProfile();
      const savedTheme = localStorage.getItem('divinity_theme') as ThemeOption;
      if (savedTheme) {
        // Use setTimeout to avoid cascading renders warning
        setTimeout(() => setTheme(savedTheme), 0);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentView('MAIN');
        setFeedbackSent(false);
        setPlayingVoiceId(null);
      }, 300);
    }
  }, [isOpen]);

  const handleSaveAvatar = async () => {
    setUserAvatarConfig(tempAvatarConfig);
    // Mock mode - save to localStorage
    const savedProfile = localStorage.getItem('divinity_user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        profile.avatarConfig = tempAvatarConfig;
        localStorage.setItem('divinity_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    localStorage.setItem('divinity_avatar_config', JSON.stringify(tempAvatarConfig));
    setCurrentView('MAIN');
  };

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem('divinity_theme', newTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    onSignOut();
  };
  
  const toggleVoicePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation();
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      setTimeout(() => {
        setPlayingVoiceId((current) => current === voiceId ? null : current);
      }, 3000);
    }
  };

  const voices = [
    { id: 'aura', name: 'Aura' },
    { id: 'nova', name: 'Nova' },
    { id: 'echo', name: 'Echo' },
    { id: 'sol', name: 'Sol' }
  ];

  const languages = [
    "English", "Español", "Français", "Deutsch", "Italiano", "日本語", "한국어"
  ];

  const colors = ['purple', 'orange', 'blue', 'pink', 'green'];
  const accessories: AvatarConfig['accessory'][] = ['none', 'glasses', 'headphones', 'crown', 'birthday'];
  
  const themeColors: Record<ThemeOption, string> = {
    sunset: "bg-gradient-to-r from-[#FF9B6A] via-[#FF6E9D] to-[#EC4899]",
    ocean: "bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#1D4ED8]",
    garden: "bg-gradient-to-r from-[#6EE7B7] via-[#10B981] to-[#047857]",
    lavender: "bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#6D28D9]"
  };

  const BRAND_GRADIENT = themeColors[theme];
  const ACCENT_COLOR = theme === 'sunset' ? "#EC4899" : theme === 'ocean' ? "#1D4ED8" : theme === 'garden' ? "#047857" : "#6D28D9";

  const renderAccessoryIcon = (type: AvatarConfig['accessory'], isActive: boolean) => {
    const colorClass = isActive ? "text-white" : "text-slate-600";
    switch (type) {
        case 'none':
            return <div className={`w-6 h-6 rounded-full border-2 ${isActive ? 'border-white' : 'border-slate-300'} flex items-center justify-center`}><div className={`w-0.5 h-full ${isActive ? 'bg-white' : 'bg-slate-300'} rotate-45`} /></div>;
        case 'glasses':
            return (
                <svg viewBox="0 0 120 40" className={`w-10 h-6 ${colorClass} fill-current`}>
                    <path d="M10 5 L45 5 L45 30 A 15 15 0 0 1 10 30 Z" opacity="0.8" />
                    <path d="M110 5 L75 5 L75 30 A 15 15 0 0 0 110 30 Z" opacity="0.8" />
                    <rect x="45" y="10" width="30" height="3" />
                </svg>
            );
        case 'headphones':
             return (
                <svg viewBox="0 0 100 80" className={`w-8 h-8 ${colorClass} fill-current`}>
                   <path d="M10 50 V30 Q10 5 50 5 Q90 5 90 30 V50" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                   <rect x="0" y="40" width="18" height="30" rx="4" />
                   <rect x="82" y="40" width="18" height="30" rx="4" />
                </svg>
             );
        case 'crown':
            return (
                <svg viewBox="0 0 100 60" className={`w-9 h-6 ${colorClass} fill-current`}>
                    <path d="M5 45 L20 15 L40 45 L50 5 L60 45 L80 15 L95 45 L95 55 L5 55 Z" />
                </svg>
            );
        case 'birthday':
             return (
                <svg viewBox="0 0 100 80" className={`w-8 h-7 ${colorClass} fill-current`}>
                    <path d="M5 60 L20 15 L40 60 L50 5 L60 60 L80 15 L95 60 L90 75 L10 75 Z" />
                    <circle cx="50" cy="5" r="4" />
                </svg>
             );
        default: return null;
    }
  };

  const SubHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="relative pt-5 px-6 flex items-center justify-between z-10 flex-shrink-0 mb-6">
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm active:scale-95 transition-transform">
        <ChevronLeft size={22} />
      </button>
      <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">{title}</h2>
      <div className="w-10" /> 
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'MAIN':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300 relative z-10">
            <div className="relative pt-5 px-6 flex items-center justify-between z-10 flex-shrink-0">
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm active:scale-95 transition-transform">
                <ChevronLeft size={22} />
              </button>
              <button onClick={() => { setTempAvatarConfig(userAvatarConfig); setCurrentView('AVATAR_CUSTOMIZE'); }} className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-2xl border border-white/40 shadow-sm p-1 flex items-center justify-center overflow-hidden active:scale-90 transition-all">
                <DigitalAvatar config={userAvatarConfig} mini forceAnimate className="w-full h-full" />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-12 z-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-[34px] font-bold text-slate-900 tracking-tight">Settings</h1>
                <Logo variant="gradient" className="h-6" hideText />
              </div>

              <div className="relative w-full rounded-[28px] overflow-hidden p-6 mb-8 shadow-lg">
                <div className={`absolute inset-0 ${BRAND_GRADIENT} opacity-100 transition-colors duration-500`} />
                <div className="absolute inset-0 bg-noise opacity-[0.12] mix-blend-overlay" />
                <div className="relative z-10">
                  <h2 className="text-white text-[24px] font-bold mb-0.5 tracking-tight">{aiName}</h2>
                  <p className="text-white/80 text-[13px] mb-5 font-semibold">Customize Your AI Bestie</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setTempName(aiName); setShowNameModal(true); }} className="py-3 rounded-[18px] border border-white/30 bg-white/15 backdrop-blur-md text-white font-bold text-[14px] active:scale-95 transition-transform flex items-center justify-center gap-2">
                      <User size={16} /> Name
                    </button>
                    <button onClick={() => setShowVoiceModal(true)} className="py-3 rounded-[18px] border border-white/30 bg-white/15 backdrop-blur-md text-white font-bold text-[14px] active:scale-95 transition-transform flex items-center justify-center gap-2">
                      <Mic size={16} /> Voice
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-3 ml-1">App</h3>
                <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                   <button onClick={() => setCurrentView('NOTIFICATIONS')} className="w-full flex items-center justify-between p-4.5 border-b border-slate-50 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                          <Bell size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Notification</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                   <button onClick={() => setCurrentView('PREFERENCES')} className="w-full flex items-center justify-between p-4.5 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                          <Sliders size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Preferences</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-3 ml-1">Support</h3>
                <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                   <button onClick={() => setCurrentView('ABOUT')} className="w-full flex items-center justify-between p-4.5 border-b border-slate-50 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center text-orange-500 shadow-sm">
                          <Info size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">About Us</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                   <button onClick={() => setCurrentView('FEEDBACK')} className="w-full flex items-center justify-between p-4.5 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                          <Heart size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Feedback</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-3 ml-1">Legal</h3>
                <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                   <button onClick={() => setCurrentView('PRIVACY')} className="w-full flex items-center justify-between p-4.5 border-b border-slate-50 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
                          <ShieldCheck size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Privacy Policy</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                   <button onClick={() => setCurrentView('TERMS')} className="w-full flex items-center justify-between p-4.5 active:bg-slate-50 transition-colors text-left group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
                          <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Terms of Service</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-active:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-3 ml-1">Account</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                     <button onClick={() => setShowSignOutModal(true)} className="w-full flex items-center gap-3.5 p-4.5 active:bg-slate-50 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm">
                          <LogOut size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-slate-700">Sign out</span>
                     </button>
                  </div>
                  <div className="bg-rose-50/30 rounded-[24px] overflow-hidden border border-rose-100 shadow-sm">
                     <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center gap-3.5 p-4.5 active:bg-rose-100/50 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                          <Trash2 size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-bold text-rose-600 tracking-tight">{"<"} Delete Account</span>
                     </button>
                  </div>
                </div>
              </div>

              <div className="text-center pb-12 flex flex-col items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
                  <Mail size={12} className="text-slate-400" />
                  <span className="text-slate-500 font-semibold text-[13px]">{userEmail}</span>
                </div>
                <p className="text-slate-300 font-black text-[12px] tracking-[0.2em] uppercase">V1.5</p>
              </div>
            </div>
          </div>
        );

      case 'AVATAR_CUSTOMIZE':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
            <div className="relative pt-5 px-6 flex items-center justify-between z-10 flex-shrink-0">
              <button onClick={() => setCurrentView('MAIN')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm active:scale-95 transition-transform">
                <ChevronLeft size={22} />
              </button>
              <button onClick={handleSaveAvatar} className={`px-6 py-2 rounded-full ${BRAND_GRADIENT} text-white font-bold text-[14px] shadow-lg active:scale-95 transition-all`}>Save</button>
            </div>
            <div className="relative flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-12 z-10">
              <h1 className="text-[34px] font-bold text-slate-900 tracking-tight mb-6">Customize</h1>
              <div className="relative w-full aspect-square bg-white rounded-[44px] mb-8 shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
                 <DigitalAvatar config={tempAvatarConfig} forceAnimate className="w-56 h-56 drop-shadow-xl relative z-10" />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-4 ml-1">Skin Color</h3>
                  <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm flex gap-4 overflow-x-auto no-scrollbar">
                    {colors.map(c => (
                      <button key={c} onClick={() => setTempAvatarConfig({...tempAvatarConfig, color: c})}
                        className={`w-12 h-12 rounded-2xl flex-shrink-0 transition-all border-4 ${tempAvatarConfig.color === c ? `scale-110 shadow-lg` : 'border-slate-50'}`}
                        style={{ backgroundColor: c === 'blue' ? '#60A5FA' : c === 'pink' ? '#F472B6' : c === 'green' ? '#34D399' : c === 'purple' ? '#A78BFA' : '#FBBF24', borderColor: tempAvatarConfig.color === c ? ACCENT_COLOR : '#F8FAFC' }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-4 ml-1">Accessory</h3>
                  <div className="grid grid-cols-3 gap-3">
                     {accessories.map((item) => (
                        <button 
                          key={item}
                          onClick={() => setTempAvatarConfig({...tempAvatarConfig, accessory: item})}
                          className={`h-14 rounded-2xl border flex items-center justify-center transition-all ${tempAvatarConfig.accessory === item ? `bg-slate-900 text-white border-slate-900 shadow-md` : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'}`}
                        >
                           {renderAccessoryIcon(item, tempAvatarConfig.accessory === item)}
                        </button>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'NOTIFICATIONS':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
            <SubHeader title="Notifications" onBack={() => setCurrentView('MAIN')} />
            <div className="flex-1 px-6">
              <div className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm p-2">
                 {[
                   { label: 'Morning Reminders', desc: 'Daily focus session alerts', icon: <Sun className="text-orange-400" size={18} />, key: 'morning' as const },
                   { label: 'AI Bestie Messages', desc: 'Alerts when Divinity speaks', icon: <Sparkles className="text-pink-400" size={18} />, key: 'ai' as const },
                   { label: 'Sound Healing', desc: 'New soundscape notifications', icon: <Volume2 className="text-indigo-400" size={18} />, key: 'sound' as const }
                 ].map((item, i) => {
                   const active = notifications[item.key];
                   return (
                    <div key={i} className={`flex items-center justify-between p-4 ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">{item.icon}</div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-800">{item.label}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleNotification(item.key)}
                          className={`w-11 h-6 rounded-full relative flex items-center px-1 transition-colors duration-300 ease-in-out ${active ? BRAND_GRADIENT : 'bg-slate-200'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                   );
                 })}
              </div>
            </div>
          </div>
        );

      case 'PREFERENCES':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
            <SubHeader title="Preferences" onBack={() => setCurrentView('MAIN')} />
            <div className="flex-1 px-6 space-y-6">
              <div className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm p-2">
                 <div className="p-4 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Volume2 size={18} /></div>
                      <span className="text-[14px] font-bold text-slate-800">Sound Effects Volume</span>
                    </div>
                    <div className="h-8 w-full flex items-center relative group">
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={volume} 
                         onChange={(e) => setVolume(Number(e.target.value))}
                         className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                       />
                       <div className="h-2 w-full bg-slate-100 rounded-full relative overflow-hidden">
                          <div 
                            className={`absolute left-0 top-0 h-full rounded-full ${BRAND_GRADIENT} transition-all duration-100`} 
                            style={{ width: `${volume}%` }} 
                          />
                       </div>
                       <div 
                         className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-slate-100 rounded-full shadow-md pointer-events-none z-10 transition-all duration-100 flex items-center justify-center" 
                         style={{ left: `${volume}%`, transform: 'translate(-50%, -50%)' }} 
                       >
                         <div className={`w-1.5 h-1.5 rounded-full ${BRAND_GRADIENT}`} />
                       </div>
                    </div>
                 </div>
                 
                 <button onClick={() => setShowLanguageModal(true)} className="w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Globe size={18} /></div>
                      <span className="text-[14px] font-bold text-slate-800">App Language</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[13px] font-bold bg-clip-text text-transparent ${BRAND_GRADIENT}`}>{selectedLanguage}</span>
                        <ChevronRight size={18} className="text-slate-300" />
                    </div>
                 </button>
              </div>

              <div>
                <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mb-3 ml-1">Color Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'sunset', label: 'Sunset', grad: 'from-[#FF9B6A] to-[#EC4899]' },
                      { id: 'ocean', label: 'Ocean', grad: 'from-[#60A5FA] to-[#1D4ED8]' },
                      { id: 'garden', label: 'Garden', grad: 'from-[#6EE7B7] to-[#047857]' },
                      { id: 'lavender', label: 'Lavender', grad: 'from-[#C4B5FD] to-[#6D28D9]' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id as ThemeOption)}
                        className={`relative h-16 rounded-[20px] overflow-hidden border transition-all ${theme === t.id ? 'border-slate-900 shadow-md scale-[1.02]' : 'border-transparent opacity-80'}`}
                      >
                         <div className={`absolute inset-0 bg-gradient-to-r ${t.grad}`} />
                         <span className="relative z-10 text-white font-bold text-[14px] drop-shadow-md">{t.label}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ABOUT':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
            <SubHeader title="About Smileey" onBack={() => setCurrentView('MAIN')} />
            <div className="px-6 pb-8 overflow-y-auto no-scrollbar">
                <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm mb-4">
                  <Logo variant="gradient" className="h-8 mb-4" textClass="text-[24px]" />
                  <p className="text-slate-600 text-[14px] leading-relaxed mb-4 font-medium">
                    Smileey is a mobile wellbeing app designed for kids and teens to help them focus, express emotions, and grow with guidance that feels safe, simple, and supportive.
                  </p>
                  <p className="text-slate-600 text-[14px] leading-relaxed font-medium mb-4">
                    The app combines a friendly AI companion called Bestie, guided reflection, sound-based focus tools, and progress tracking into one easy daily experience. Bestie chats in short, clear, age-appropriate messages and uses what it learns during onboarding to personalize conversations, journaling prompts, and recommendations.
                  </p>
                </div>
            </div>
          </div>
        );

      case 'FEEDBACK':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
            <SubHeader title="Send Feedback" onBack={() => setCurrentView('MAIN')} />
            <div className="px-6 flex-1 flex flex-col">
                {feedbackSent ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle2 size={32} strokeWidth={3} />
                      </div>
                      <h3 className="text-slate-900 font-bold text-[20px] mb-2">Thank You!</h3>
                      <button onClick={() => setCurrentView('MAIN')} className={`mt-8 px-8 py-3 rounded-full font-bold text-[14px] text-white shadow-lg active:scale-95 transition-transform ${BRAND_GRADIENT}`}>Back to Settings</button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-[28px] p-2 border border-slate-100 shadow-sm flex-1 mb-4 flex flex-col focus-within:ring-2 ring-opacity-50 ring-offset-2 transition-all" style={{ '--tw-ring-color': ACCENT_COLOR } as React.CSSProperties}>
                        <textarea 
                          className="w-full h-full p-4 resize-none outline-none text-slate-700 font-medium placeholder-slate-300 text-[15px] rounded-[24px]"
                          placeholder="Tell us what you love or what we can improve..."
                        />
                    </div>
                    <button onClick={() => setFeedbackSent(true)} className={`w-full py-4 rounded-[20px] text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg mb-8 ${BRAND_GRADIENT}`}>
                        <Send size={18} /> Send Feedback
                    </button>
                  </>
                )}
            </div>
          </div>
        );

      case 'PRIVACY':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
              <SubHeader title="Privacy Policy" onBack={() => setCurrentView('MAIN')} />
              <div className="px-6 pb-8 overflow-y-auto no-scrollbar">
                <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm prose prose-slate prose-sm max-w-none">
                    <h4 className="font-bold text-slate-900 text-[16px] mb-2">Effective Date: January 31, 2026</h4>
                    <p className="text-slate-600 font-medium text-[13px] mb-4">
                      Your privacy is important to us. This Privacy Policy explains how Divinity Reflections collects, uses, and protects information when you use the app.
                    </p>
                </div>
              </div>
          </div>
        );

      case 'TERMS':
        return (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative z-10">
              <SubHeader title="Terms of Service" onBack={() => setCurrentView('MAIN')} />
              <div className="px-6 pb-8 overflow-y-auto no-scrollbar">
                <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm prose prose-slate prose-sm max-w-none">
                    <h4 className="font-bold text-slate-900 text-[16px] mb-2">Effective Date: January 31, 2026</h4>
                </div>
              </div>
          </div>
        );
        
      default: return null;
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
         {renderView()}
      </div>

      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300" />
      )}

      {showSignOutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl text-center animate-in zoom-in-95">
              <h3 className="text-[20px] font-bold text-slate-900 mb-2">Sign Out?</h3>
              <p className="text-slate-500 font-medium text-[14px] mb-6">Are you sure you want to sign out?</p>
              <div className="flex flex-col gap-3">
                 <button onClick={handleLogout} className={`w-full py-3.5 rounded-2xl text-white font-bold text-[15px] shadow-lg active:scale-95 transition-transform ${BRAND_GRADIENT}`}>Yes, Sign Out</button>
                 <button onClick={() => setShowSignOutModal(false)} className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-95 transition-transform">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl text-center animate-in zoom-in-95">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-2">Delete Account?</h3>
              <div className="flex flex-col gap-3">
                 <button onClick={() => setShowDeleteModal(false)} className="w-full py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-[15px] shadow-lg active:scale-95 transition-transform">Delete Forever</button>
                 <button onClick={() => setShowDeleteModal(false)} className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-95 transition-transform">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {showVoiceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 relative">
              <button onClick={() => setShowVoiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
              <h3 className="text-[20px] font-bold text-slate-900 mb-6 text-center">Choose Voice</h3>
              <div className="space-y-3">
                 {voices.map(v => {
                   const isSelected = selectedVoice === v.name;
                   const isPlaying = playingVoiceId === v.id;
                   const containerClass = isSelected ? `${BRAND_GRADIENT} text-white shadow-lg` : 'bg-slate-50 text-slate-700';
                   return (
                     <div key={v.id} className={`w-full p-2.5 rounded-2xl flex items-center gap-3 transition-all ${containerClass}`}>
                        <button 
                          onClick={(e) => toggleVoicePreview(e, v.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform ${isSelected ? 'bg-white/20' : 'bg-white shadow-sm'}`}
                        >
                           {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button 
                          onClick={() => { setSelectedVoice(v.name); setShowVoiceModal(false); }}
                          className="flex-1 flex items-center justify-between text-left h-full"
                        >
                           <span className="font-bold text-[15px]">{v.name}</span>
                           {isSelected && <CheckCircle2 size={18} />}
                        </button>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      )}

       {showLanguageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 relative max-h-[70vh] flex flex-col">
              <button onClick={() => setShowLanguageModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
              <h3 className="text-[20px] font-bold text-slate-900 mb-6 text-center flex-shrink-0">Language</h3>
              <div className="space-y-2 overflow-y-auto no-scrollbar pr-1">
                 {languages.map(lang => (
                   <button 
                    key={lang} 
                    onClick={() => { setSelectedLanguage(lang); setShowLanguageModal(false); }}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all ${selectedLanguage === lang ? `${BRAND_GRADIENT} text-white shadow-lg` : 'bg-slate-50 text-slate-700'}`}
                   >
                      <span className="font-bold text-[15px]">{lang}</span>
                      {selectedLanguage === lang && <CheckCircle2 size={18} />}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
      
      {showNameModal && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-xs rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-[20px] font-bold text-slate-900 mb-4 text-center">Name Your Bestie</h3>
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center font-bold text-slate-800 text-[18px] mb-6 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ '--tw-ring-color': ACCENT_COLOR, borderColor: tempName ? ACCENT_COLOR : undefined } as React.CSSProperties}
                autoFocus
              />
              <div className="flex flex-col gap-3">
                 <button 
                  onClick={async () => { 
                    setAiName(tempName); 
                    const user = auth.currentUser;
                    if (user) {
                      await updateUserProfile(user.uid, { aiName: tempName });
                    }
                    setShowNameModal(false); 
                  }} 
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-[15px] shadow-lg active:scale-95 transition-transform ${BRAND_GRADIENT}`}
                 >
                   Save Name
                 </button>
                 <button onClick={() => setShowNameModal(false)} className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-[15px] active:scale-95 transition-transform">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
