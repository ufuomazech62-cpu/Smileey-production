'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserMode, SoundTrack } from '@/types';
import HealLibrary from '@/features/heal/HealLibrary';
import HealPlayer from '@/features/heal/HealPlayer';
import { getCurrentUser } from '@/services/authService';

interface HealProps {
  userMode: UserMode;
  setNavVisible?: (visible: boolean) => void;
}

const initialTracks: SoundTrack[] = [
  { id: '1', title: '5D Journey (Guided)', category: 'Meditation', duration: '5:00', color: 'bg-violet-400', audioUrl: '/audio/5d-journey.mp3' },
  { id: '2', title: 'Love Frequency (532Hz)', category: 'Meditation', duration: '5:00', color: 'bg-pink-400', audioUrl: '/audio/love-532hz.mp3' },
  { id: '3', title: 'Chakra Journey', category: 'Meditation', duration: '5:01', color: 'bg-emerald-400', audioUrl: '/audio/chakra.mp3' },
  { id: '4', title: 'Birds & Piano', category: 'Meditation', duration: '4:30', color: 'bg-blue-400', audioUrl: '/audio/birds-piano.mp3' },
  { id: '5', title: 'Singing Bowl', category: 'Meditation', duration: '3:15', color: 'bg-amber-400', audioUrl: '/audio/bowl.mp3' },
  { id: '6', title: 'Gentle Breeze', category: 'Sleep', duration: '6:00', color: 'bg-slate-400', audioUrl: '/audio/breeze.mp3' },
  { id: '7', title: 'Deep Flute', category: 'Meditation', duration: '5:45', color: 'bg-orange-400', audioUrl: '/audio/flute.mp3' },
  { id: '8', title: 'Lo-Fi Focus', category: 'Reading', duration: '4:00', color: 'bg-indigo-400', audioUrl: '/audio/lofi.mp3' },
  { id: '9', title: 'Guided Meditation', category: 'Meditation', duration: '10:00', color: 'bg-purple-400', audioUrl: '/audio/meditation.mp3' },
  { id: '10', title: 'Moray Echoes', category: 'Meditation', duration: '5:20', color: 'bg-cyan-400', audioUrl: '/audio/moray.mp3' },
  { id: '11', title: 'Ocean Waves', category: 'Sleep', duration: '8:00', color: 'bg-blue-500', audioUrl: '/audio/ocean.mp3' },
  { id: '12', title: 'Soft Rain', category: 'Sleep', duration: '7:30', color: 'bg-slate-500', audioUrl: '/audio/rain.mp3' },
  { id: '13', title: 'Rising Sun', category: 'Meditation', duration: '4:45', color: 'bg-yellow-400', audioUrl: '/audio/rising-sun.mp3' },
  { id: '14', title: 'Pure Serenity', category: 'Meditation', duration: '6:15', color: 'bg-teal-400', audioUrl: '/audio/serenity.mp3' },
  { id: '15', title: 'Sound Bath', category: 'Meditation', duration: '12:00', color: 'bg-fuchsia-400', audioUrl: '/audio/sound-bath.mp3' },
  { id: '16', title: 'Yoga Flow', category: 'Meditation', duration: '5:30', color: 'bg-lime-400', audioUrl: '/audio/yoga.mp3' },
];

const Heal: React.FC<HealProps> = ({ userMode, setNavVisible }) => {
  const [trackList, setTrackList] = useState<SoundTrack[]>(initialTracks);
  const [viewState, setViewState] = useState<'LIBRARY' | 'PLAYER'>('LIBRARY');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<SoundTrack | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Define handleTrackComplete before using it
  const handleTrackComplete = useCallback(async () => {
    // Mock mode - just log the completion
    if (activeTrack) {
      console.log('Track completed:', activeTrack.title);
      // Could save to localStorage for streak tracking
    }
    setIsPlaying(false);
  }, [activeTrack]);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleTrackComplete();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleTrackComplete]);

  // Sync Audio source when track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (activeTrack?.audioUrl) {
      console.log('Audio Source Changing to:', activeTrack.audioUrl);
      const fullUrl = window.location.origin + activeTrack.audioUrl;
      console.log('Full Audio URL:', fullUrl);
      
      audioRef.current.src = activeTrack.audioUrl;
      audioRef.current.load();
      
      fetch(activeTrack.audioUrl, { method: 'HEAD' })
        .then(res => {
          if (!res.ok) console.error(`Audio file not found at ${activeTrack.audioUrl} (Status: ${res.status})`);
          else console.log(`Audio file confirmed at ${activeTrack.audioUrl}`);
        })
        .catch(err => console.error(`Error verifying audio file at ${activeTrack.audioUrl}:`, err));

      if (isPlaying) {
        audioRef.current.play()
          .then(() => console.log('Playback started successfully after track change'))
          .catch(err => console.error('Play error on track change:', err));
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [activeTrack]);

  // Sync Play/Pause state
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying) {
      console.log('Attempting Play...');
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Playback started successfully'))
          .catch(err => {
            console.error('Playback failed. User interaction might be required:', err);
            setIsPlaying(false);
          });
      }
    } else {
      console.log('Pausing Audio');
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: SoundTrack) => {
    if (activeTrack?.id === track.id) {
      setIsPlaying(true);
      setViewState('PLAYER');
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
      setProgress(0);
      setViewState('PLAYER');
    }
  };

  const handleDeleteTrack = (id: string) => {
    setTrackList(prev => prev.filter(t => t.id !== id));
    if (activeTrack?.id === id) {
      setIsPlaying(false);
      setActiveTrack(null);
    }
  };

  const handleNext = () => {
    if (!activeTrack) return;
    const idx = trackList.findIndex(t => t.id === activeTrack.id);
    if (idx === -1) return;
    const nextTrack = trackList[(idx + 1) % trackList.length];
    playTrack(nextTrack);
  };

  const handlePrev = () => {
    if (!activeTrack) return;
    const idx = trackList.findIndex(t => t.id === activeTrack.id);
    if (idx === -1) return;
    const prevTrack = trackList[(idx - 1 + trackList.length) % trackList.length];
    playTrack(prevTrack);
  };

  useEffect(() => {
    if (viewState === 'PLAYER') {
      setNavVisible?.(false);
    } else {
      setNavVisible?.(true);
    }
  }, [viewState, setNavVisible]);

  if (viewState === 'LIBRARY') {
    return (
      <HealLibrary 
        tracks={trackList}
        activeTrack={activeTrack}
        isPlaying={isPlaying}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPlayTrack={playTrack}
        onTogglePlay={togglePlay}
        onOpenPlayer={() => setViewState('PLAYER')}
        onDeleteTrack={handleDeleteTrack}
      />
    );
  }

  if (viewState === 'PLAYER' && activeTrack) {
    return (
      <HealPlayer
        activeTrack={activeTrack}
        isPlaying={isPlaying}
        progress={progress}
        onClose={() => setViewState('LIBRARY')}
        onTogglePlay={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );
  }

  return null;
};

export default Heal;
