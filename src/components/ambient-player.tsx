
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview A reusable ambient audio player for reflection modules.
 * - url: The URL of the MP3 track to play.
 */
export function AmbientPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2; // Keep it subtle

    // Browsers often block auto-play without user interaction.
    // We attempt to play, but fallback gracefully.
    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.log("Auto-play blocked; waiting for user interaction.");
            setIsPlaying(false);
          });
      }
    };

    startAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className={`h-14 w-14 rounded-full border-2 border-white shadow-xl backdrop-blur-xl transition-all hover:scale-110 active:scale-95 ${
          isPlaying ? 'bg-primary/20' : 'bg-white/40'
        }`}
      >
        {isPlaying ? (
          <Volume2 className="h-6 w-6 text-primary animate-pulse" />
        ) : (
          <VolumeX className="h-6 w-6 text-muted-foreground" />
        )}
      </Button>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-white text-[9px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Ambient Soundscape
      </div>
    </div>
  );
}
