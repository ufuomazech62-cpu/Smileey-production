'use client';

import React, { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';
import { Mail, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { loginWithGoogle, sendMagicLink, completeEmailSignIn } from '@/services/authService';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'MAIN' | 'EMAIL'>('MAIN');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalType, setLegalType] = useState<'TERMS' | 'PRIVACY'>('TERMS');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      onLogin();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      await sendMagicLink(email);
      setErrorMsg("Check your email for the magic link!");
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    completeEmailSignIn().then(user => {
      if (user) onLogin();
    }).catch(err => {
      console.error(err);
      setErrorMsg("Failed to confirm email link.");
    });
  }, [onLogin]);

  const openLegal = (type: 'TERMS' | 'PRIVACY') => {
    setLegalType(type);
    setShowLegalModal(true);
  };

  const renderLegalContent = () => {
     if (legalType === 'PRIVACY') {
      return (
        <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-[18px] mb-2">Effective Date: January 31, 2026</h4>
            <p className="text-slate-600 font-medium text-[14px] leading-relaxed mb-6 italic">
              Your privacy matters to us. This Privacy Policy explains how Smileey collects, uses, and protects your information.
            </p>
            <section>
              <h5 className="font-bold text-slate-800 text-[15px] mb-2">Information We Collect</h5>
              <p className="text-slate-500 font-medium text-[14px]">We may collect limited information such as:</p>
              <ul className="list-disc ml-5 mt-2 text-slate-500 font-medium text-[14px] space-y-1">
                <li>Account details (such as email address)</li>
                <li>App usage data (to improve features and performance)</li>
              </ul>
              <p className="text-slate-800 font-bold text-[14px] mt-2">We do not sell personal data.</p>
            </section>
        </div>
      );
    }
    return (
      <div className="space-y-6">
          <h4 className="font-bold text-slate-900 text-[18px] mb-2">Effective Date: January 31, 2026</h4>
          <p className="text-slate-600 font-medium text-[14px] leading-relaxed mb-6 italic">By using Smileey, you agree to the following terms.</p>
          <section>
            <h5 className="font-bold text-slate-800 text-[15px] mb-2">Use of the Platform</h5>
            <p className="text-slate-500 font-medium text-[14px]">Smileey is intended for personal wellbeing, focus, and reflection. It is not a replacement for medical, psychological, or emergency services.</p>
          </section>
      </div>
    );
  };

  return (
    <div className="h-full w-full relative flex flex-col p-8 animate-in fade-in duration-700 bg-transparent">
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[40px] backdrop-saturate-[180%] bg-white/60"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xs mx-auto relative z-10">
        <div className="flex flex-col items-center mb-10">
           {/* Smileey Logo Icon */}
           <div className="h-24 opacity-100 mb-0">
             <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
               <circle cx="50" cy="50" r="45" fill="#f5496c" />
               <circle cx="35" cy="40" r="8" fill="white" />
               <circle cx="65" cy="40" r="8" fill="white" />
               <path d="M30 65 Q50 85 70 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
             </svg>
           </div>
           <span className="font-display text-black text-[42px] leading-none mb-8">Smileey</span>
           <h1 className="text-black text-[32px] font-bold text-center leading-tight mb-2 tracking-tight">Welcome back.</h1>
           <p className="text-black/70 text-center text-[16px] font-medium leading-relaxed max-w-[260px]">This space is for focus, reflection, and growth.</p>
        </div>

        <div className="w-full min-h-[180px] flex items-end">
           {viewMode === 'MAIN' ? (
             <div className="w-full space-y-3 z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full h-14 bg-white rounded-full flex items-center justify-center relative active:scale-95 transition-all group overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.05)' }}>
                 <div className="absolute left-5">
                   <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                   </svg>
                 </div>
                 <span className="text-black font-bold text-[15px] tracking-tight">Continue with Google</span>
               </button>
               <button onClick={() => setViewMode('EMAIL')} disabled={isLoading} className="w-full h-14 bg-black/5 backdrop-blur-md border border-black/20 rounded-full flex items-center justify-center relative active:scale-95 transition-all text-black group">
                 <div className="absolute left-5 text-black/80 group-hover:text-black transition-colors">
                   <Mail size={20} strokeWidth={2.5} />
                 </div>
                 <span className="font-bold text-[15px] tracking-tight">Use Email</span>
               </button>
               {errorMsg && <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-3 text-center text-black text-[13px] font-medium">{errorMsg}</div>}
             </div>
           ) : (
             <div className="w-full z-20 animate-in fade-in slide-in-from-right-8 duration-500">
               <button onClick={() => { setViewMode('MAIN'); setErrorMsg(''); }} disabled={isLoading} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black mb-4 active:scale-90 transition-transform">
                 <ArrowLeft size={20} strokeWidth={2.5} />
               </button>
               <div className="relative mb-6">
                 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                 <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus className="w-full h-14 bg-black/5 backdrop-blur-md border border-black/20 rounded-full pl-14 pr-6 text-black placeholder-black/40 font-medium outline-none focus:bg-black/10 focus:border-[#f5496c] transition-all text-[16px]" />
               </div>
               {errorMsg && <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-3 text-center mb-4 text-black text-[13px] font-medium">{errorMsg}</div>}
               <button onClick={handleEmailAuth} disabled={!email || isLoading} className={`w-full h-14 rounded-full flex items-center justify-center gap-2 font-bold text-[15px] shadow-xl transition-all ${(!email) ? 'bg-black/50 text-white' : 'bg-[#f5496c] text-white active:scale-95'}`}>
                 {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continue <ArrowRight size={18} strokeWidth={3} /></>}
               </button>
             </div>
           )}
        </div>
      </div>
      <p className="text-black/40 text-[11px] font-medium text-center pb-2 max-w-xs mx-auto leading-relaxed relative z-10">
        By continuing, you acknowledge our <button onClick={() => openLegal('TERMS')} className="underline">Terms</button> & <button onClick={() => openLegal('PRIVACY')} className="underline">Privacy Policy</button>.
      </p>
      {showLegalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-md max-h-[80vh] rounded-[40px] p-8 relative flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowLegalModal(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 active:scale-90 shadow-sm hover:bg-slate-200"><X size={22} /></button>
              <h3 className="text-[24px] font-bold text-slate-900 mb-6 mt-2">{legalType === 'TERMS' ? 'Terms of Service' : 'Privacy Policy'}</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar pr-2">{renderLegalContent()}</div>
              <div className="pt-6 mt-2 border-t border-slate-100">
                 <button onClick={() => setShowLegalModal(false)} className="w-full h-14 rounded-full bg-slate-900 text-white font-bold text-[16px] shadow-lg active:scale-95 transition-all">I Understand</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
