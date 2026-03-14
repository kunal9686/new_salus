"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PLAYLIST = [
  {
    id: "1",
    title: "Celestial Lofi",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3",
  },
  {
    id: "2",
    title: "Sanctuary Echoes",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1cbd.mp3",
  },
  {
    id: "3",
    title: "Ethereal Calm",
    url: "https://cdn.pixabay.com/audio/2021/11/25/audio_91b123f149.mp3",
  }
];

export function GlobalAudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(40);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial mounting check for hydration safety
  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio(PLAYLIST[0].url);
    audioRef.current.volume = volume / 100;
    audioRef.current.loop = false;

    // Handle song ending to trigger next track
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audioRef.current.addEventListener('ended', handleEnded);

    // Global interaction listener to "unlock" audio for autoplay
    const unlockAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => { /* Autoplay still blocked */ });
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      }
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Sync track changes
  useEffect(() => {
    if (!audioRef.current || !mounted) return;
    
    audioRef.current.src = PLAYLIST[currentTrackIndex].url;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIndex, mounted]);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col items-center">
      {/* Main Speaker Button */}
      <button
        suppressHydrationWarning
        onClick={toggleOpen}
        className={cn(
          "size-14 rounded-full border-4 border-white shadow-2xl transition-all duration-500 ease-in-out flex items-center justify-center relative z-10",
          isOpen ? "rotate-[360deg] bg-primary scale-110" : "bg-white/90 backdrop-blur-xl hover:scale-105"
        )}
      >
        {volume === 0 ? (
          <VolumeX className={cn("size-6", isOpen ? "text-white" : "text-primary")} />
        ) : (
          <Volume2 className={cn("size-6", isOpen ? "text-white" : "text-primary", isPlaying && "animate-pulse")} />
        )}
        
        {isPlaying && !isOpen && (
          <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-secondary border-2 border-white animate-bounce shadow-sm" />
        )}
      </button>

      {/* Control Panel (Slides down) */}
      <div 
        className={cn(
          "mt-3 transition-all duration-500 origin-top flex flex-col items-center gap-4",
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-white/90 backdrop-blur-3xl border-4 border-white rounded-[3rem] p-5 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center gap-6 w-16">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 select-none">Vol</span>
          
          <div className="h-40 flex justify-center py-2">
             <Slider
                orientation="vertical"
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(val) => setVolume(val[0])}
                className="h-full"
              />
          </div>

          <Music className="size-4 text-primary/30 animate-spin-slow" />
        </div>

        {/* Status Pill Button */}
        <button
          suppressHydrationWarning
          onClick={togglePlay}
          className={cn(
            "bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full border-2 border-white shadow-xl flex items-center gap-3 transition-all active:scale-95 hover:bg-white group",
            isPlaying ? "border-primary/20" : "opacity-80"
          )}
        >
          <div className={cn(
            "size-6 rounded-full flex items-center justify-center transition-colors",
            isPlaying ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {isPlaying ? <Pause className="size-3 fill-current" /> : <Play className="size-3 fill-current ml-0.5" />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70 select-none">
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </button>
      </div>
    </div>
  );
}
