
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview A robust ambient audio player for reflection modules.
 * - url: The URL of the MP3 track to play.
 */
export function AmbientPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state on URL change
    setHasError(false);
    setIsPlaying(false);

    const audio = new Audio();
    audio.src = url;
    audio.loop = true;
    audio.volume = 0.15; // Soft background volume
    audio.preload = "auto";
    audioRef.current = audio;

    const handleCanPlay = () => {
      // Browsers often block auto-play without user interaction.
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // This is expected if the user hasn't interacted with the page yet
          setIsPlaying(false);
        });
    };

    const handleError = (e: any) => {
      console.error("AmbientPlayer: Audio source error", e);
      setHasError(true);
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current || hasError) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={hasError}
          className={`h-12 w-12 rounded-full border-2 border-white shadow-xl backdrop-blur-xl transition-all hover:scale-110 active:scale-95 ${
            isPlaying ? 'bg-primary/20' : 'bg-white/40'
          } ${hasError ? 'border-destructive/50 opacity-50' : ''}`}
        >
          {hasError ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : isPlaying ? (
            <Volume2 className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white text-[9px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
          {hasError ? "Soundscape Unavailable" : isPlaying ? "Ambient: Playing" : "Ambient: Muted"}
        </div>
      </div>
    </div>
  );
}
