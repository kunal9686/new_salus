
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Loader2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PLAYLIST = [
  "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3", // Lofi Study
  "https://cdn.pixabay.com/audio/2022/05/27/audio_1808737487.mp3", // Rain & Lofi
  "https://cdn.pixabay.com/audio/2021/11/25/audio_91b325ef02.mp3", // Pure Rain
];

export function GlobalAudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNextTrack = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const audio = new Audio();
    audio.volume = volume / 100;
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => handleNextTrack();
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: any) => {
      console.warn("GlobalAudioPlayer: Media Error, skipping...", e);
      setIsBuffering(false);
      setTimeout(handleNextTrack, 500);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    const startAudioOnInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(() => {});
      }
      ["mousedown", "keydown", "touchstart", "click"].forEach(event => 
        window.removeEventListener(event, startAudioOnInteraction)
      );
    };
    
    ["mousedown", "keydown", "touchstart", "click"].forEach(event => 
      window.addEventListener(event, startAudioOnInteraction)
    );

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [mounted, handleNextTrack]);

  useEffect(() => {
    if (audioRef.current && mounted) {
      const currentSrc = PLAYLIST[trackIndex];
      if (audioRef.current.src !== currentSrc) {
        audioRef.current.src = currentSrc;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }
    }
  }, [trackIndex, mounted, isPlaying]);

  useEffect(() => {
    if (audioRef.current && mounted) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, mounted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Manual play failed:", err);
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col items-center" suppressHydrationWarning>
      <div className="relative flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          suppressHydrationWarning
          className={cn(
            "h-12 w-12 rounded-full border-4 border-white shadow-xl backdrop-blur-2xl transition-all duration-500 hover:scale-110 active:scale-95 bg-white/60",
            isExpanded && "rotate-180"
          )}
        >
          {volume === 0 ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : isBuffering ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Volume2 className={cn("h-5 w-5 text-primary", isPlaying && "animate-pulse")} />
          )}
        </Button>

        <div
          className={cn(
            "mt-3 transition-all duration-500 ease-in-out origin-top flex flex-col items-center",
            isExpanded ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-90 pointer-events-none"
          )}
        >
          <div className="bg-white/80 backdrop-blur-2xl border-4 border-white rounded-[2.5rem] p-4 py-6 shadow-2xl flex flex-col items-center gap-4 w-14">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary select-none" suppressHydrationWarning>Vol</span>
            <div className="h-32 w-full flex justify-center">
              <Slider
                orientation="vertical"
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(val) => setVolume(val[0])}
                className="h-full cursor-pointer"
              />
            </div>
          </div>

          <button 
            onClick={togglePlay}
            suppressHydrationWarning
            className="mt-4 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full border-2 border-white shadow-lg flex items-center gap-3 cursor-pointer hover:bg-white transition-all active:scale-95 group"
          >
             <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors pointer-events-none">
                {isPlaying ? (
                  <Pause className="size-2.5 text-primary fill-current" />
                ) : (
                  <Play className="size-2.5 text-primary fill-current ml-0.5" />
                )}
             </div>
             <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground select-none pointer-events-none" suppressHydrationWarning>
               {isPlaying ? "Playing" : "Paused"}
             </span>
          </button>
        </div>
      </div>
    </div>
  );
}
