'use client';

import React, { useState } from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { UserProfile } from '@/types';
import { getCurrentUser } from '@/services/authService';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    schoolLevel: '',
    struggles: [],
    recentMood: '',
    primaryGoal: ''
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    setIsSaving(true);

    const user = getCurrentUser();

    const completeProfile: UserProfile = {
      name: profile.name || 'Friend',
      ageGroup: '',
      schoolLevel: profile.schoolLevel || 'Not Specified',
      struggles: profile.struggles || [],
      recentMood: profile.recentMood || '',
      primaryGoal: profile.primaryGoal || '',
      onboardingComplete: true
    };

    try {
      console.log("Saving profile (mock mode)...", user?.uid || 'mock-user');
      localStorage.setItem('divinity_user_profile', JSON.stringify(completeProfile));
      console.log("Profile saved successfully to localStorage");

      setTimeout(() => {
        onComplete(completeProfile);
      }, 100);

    } catch (error) {
      console.error("Critical error saving profile:", error);
      localStorage.setItem('divinity_user_profile', JSON.stringify(completeProfile));
      onComplete(completeProfile);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleStruggle = (item: string) => {
    const current = profile.struggles || [];
    if (current.includes(item)) {
      updateProfile('struggles', current.filter(i => i !== item));
    } else {
      updateProfile('struggles', [...current, item]);
    }
  };

  const steps = [
    // 1. IDENTITY
    {
      title: "What should we call you?",
      subtitle: "First name or nickname is perfect.",
      content: (
        <div className="w-full mt-4">
          <input
            type="text"
            placeholder="Your name..."
            value={profile.name}
            onChange={(e) => updateProfile('name', e.target.value)}
            className="w-full bg-black/5 border border-black/20 rounded-2xl px-6 py-4 text-black placeholder-black/40 text-[22px] font-bold outline-none focus:bg-black/10 focus:border-[#f5496c] transition-all text-center"
            autoFocus
          />
        </div>
      ),
      isValid: !!profile.name
    },
    // 2. CONTEXT
    {
      title: "What level fits you best?",
      subtitle: "This helps your AI bestie understand your world.",
      content: (
        <div className="space-y-2.5 w-full mt-2">
          {['Elementary', 'Middle School', 'High School', 'College', 'Other'].map(level => (
            <button
              key={level}
              onClick={() => { updateProfile('schoolLevel', level); }}
              className={`w-full p-3.5 rounded-xl border text-left transition-all font-bold text-[16px] ${profile.schoolLevel === level ? 'bg-[#f5496c] text-white border-[#f5496c]' : 'bg-black/5 border-black/20 text-black hover:bg-black/10'}`}
            >
              {level}
            </button>
          ))}
        </div>
      ),
      isValid: !!profile.schoolLevel
    },
    // 3. STRUGGLES
    {
      title: "Do any of these feel hard?",
      subtitle: "Select as many as you like.",
      content: (
        <div className="grid grid-cols-2 gap-2.5 w-full mt-2 pb-4">
          {['Staying Focused', 'Reading', 'Math', 'Writing', 'Tests', 'Feeling Anxious', 'Sleep', 'Making Friends'].map(item => {
            const isSelected = profile.struggles?.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleStruggle(item)}
                className={`p-2 rounded-xl border text-center transition-all font-semibold text-[13px] leading-tight flex items-center justify-center h-16 ${isSelected ? 'bg-[#f5496c] text-white border-[#f5496c] shadow-lg' : 'bg-black/5 border-black/20 text-black hover:bg-black/10'}`}
              >
                {item}
              </button>
            )
          })}
        </div>
      ),
      isValid: true
    },
    // 4. MOOD
    {
      title: "How has your mind felt lately?",
      subtitle: "There is no wrong answer.",
      content: (
        <div className="space-y-2.5 w-full mt-2">
          {[
            { label: 'Busy / Loud', icon: '🌪️' },
            { label: 'Tired / Low Energy', icon: '🔋' },
            { label: 'Distracted', icon: '😶‍🌫️' },
            { label: 'Okay / Calm', icon: '😌' },
            { label: 'Focused', icon: '🎯' }
          ].map((mood) => (
            <button
              key={mood.label}
              onClick={() => { updateProfile('recentMood', mood.label); }}
              className={`w-full p-3.5 rounded-xl border text-left transition-all font-bold text-[16px] flex items-center gap-4 ${profile.recentMood === mood.label ? 'bg-[#f5496c] text-white border-[#f5496c]' : 'bg-black/5 border-black/20 text-black hover:bg-black/10'}`}
            >
              <span className="text-2xl">{mood.icon}</span> {mood.label}
            </button>
          ))}
        </div>
      ),
      isValid: !!profile.recentMood
    },
    // 5. GOALS
    {
      title: "What do you want to work on?",
      subtitle: "We'll start small together.",
      content: (
        <div className="space-y-2.5 w-full mt-2">
          {[
            'Focus better',
            'Feel more organized',
            'Express my thoughts',
            'Build a daily habit',
            'Just explore'
          ].map(goal => (
            <button
              key={goal}
              onClick={() => { updateProfile('primaryGoal', goal); }}
              className={`w-full p-3.5 rounded-xl border text-left transition-all font-bold text-[16px] ${profile.primaryGoal === goal ? 'bg-[#f5496c] text-white border-[#f5496c]' : 'bg-black/5 border-black/20 text-black hover:bg-black/10'}`}
            >
              {goal}
            </button>
          ))}
        </div>
      ),
      isValid: !!profile.primaryGoal
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="h-full w-full relative flex flex-col font-sans px-6 pt-6 pb-4 animate-in fade-in duration-500 overflow-hidden bg-transparent">
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[40px] backdrop-saturate-[180%] bg-white/60 pointer-events-none" />

       <div className="flex justify-between items-center mb-6 relative z-20 h-10 flex-shrink-0">
         {step > 0 ? (
           <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black active:scale-90 transition-transform"
           >
             <ChevronLeft size={24} strokeWidth={2.5} />
           </button>
         ) : (
           <div className="w-10" />
         )}

         <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">
           {steps.map((_, i) => (
             <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-[#f5496c]' : i < step ? 'w-1.5 bg-[#f5496c]/60' : 'w-1.5 bg-black/20'}`}
             />
           ))}
         </div>

         { (step > 1) && (
          <button
            onClick={handleSkip}
            className="text-black/60 font-semibold text-[14px] px-3 py-1 rounded-full hover:bg-black/10 transition-colors"
          >
            Skip
          </button>
         )}
       </div>

       <div className="flex-1 flex flex-col relative z-10 overflow-y-auto no-scrollbar">
          <div key={step} className="animate-in slide-in-from-right-8 fade-in duration-500 pb-20">
             <h2 className="text-black text-[32px] font-bold leading-tight mb-2 tracking-tight">{currentStep.title}</h2>
             <p className="text-black/70 text-[18px] font-medium leading-normal mb-6">{currentStep.subtitle}</p>
             {currentStep.content}
          </div>
       </div>

       {currentStep.isValid && (
         <div className="absolute bottom-6 right-6 z-30">
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="h-14 px-8 bg-[#f5496c] text-white rounded-full font-bold text-[16px] flex items-center gap-2 shadow-xl active:scale-95 transition-transform disabled:opacity-80"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === steps.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
                </>
              )}
            </button>
         </div>
       )}
    </div>
  );
};

export default Onboarding;
