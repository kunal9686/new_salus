
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const PLAYLIST = [
  "https://cdn.pixabay.com/audio/2022/05/27/audio_1808d3030e.mp3", // Lofi
  "https://cdn.pixabay.com/audio/2024/05/01/audio_3306637841.mp3", // Calm Lofi
  "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7351a.mp3", // Gentle Rain
];

export function GlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create new audio instance for current track
    const audio = new Audio(PLAYLIST[trackIndex]);
    audio.volume = volume / 100;
    audio.loop = false;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    const handleCanPlayThrough = () => {
      // Browsers often block auto-play without user interaction.
      // We try to play, but catch if blocked.
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    // Global listener to start audio on first interaction if blocked
    const startAudioOnInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
      window.removeEventListener("click", startAudioOnInteraction);
    };
    window.addEventListener("click", startAudioOnInteraction);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      window.removeEventListener("click", startAudioOnInteraction);
      audio.pause();
      audio.src = "";
    };
  }, [trackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 rounded-[1.75rem] border-4 border-white shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:scale-110 active:scale-95 bg-white/60",
            isExpanded && "rotate-180"
          )}
        >
          {volume === 0 ? (
            <VolumeX className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Volume2 className={cn("h-6 w-6 text-primary", isPlaying && "animate-pulse")} />
          )}
        </Button>

        <div
          className={cn(
            "mt-4 transition-all duration-500 ease-in-out origin-top flex flex-col items-center",
            isExpanded ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-90 pointer-events-none"
          )}
        >
          <div className="bg-white/70 backdrop-blur-2xl border-4 border-white rounded-[2rem] p-6 shadow-2xl flex flex-col items-center gap-4 w-16">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary rotate-0">Vol</span>
            <div className="h-40 w-full flex justify-center">
              <Slider
                orientation="vertical"
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(val) => setVolume(val[0])}
                className="h-full"
              />
            </div>
          </div>
          <div className="mt-3 bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full border-2 border-white shadow-lg flex items-center gap-2">
             <Music className="size-3 text-primary animate-spin-slow" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Sanctuary Mix</span>
          </div>
        </div>
      </div>
    </div>
  );
}
