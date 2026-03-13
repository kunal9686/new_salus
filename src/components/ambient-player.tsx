"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview A robust ambient audio player for reflection modules.
 * - url: The URL of the MP3 track to play.
 */
export function AmbientPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state on URL change
    setHasError(false);
    setIsPlaying(false);
    setIsLoading(true);

    const audio = new Audio();
    audio.src = url;
    audio.loop = true;
    audio.volume = 0.2; // Soft background volume
    audio.preload = "auto";
    audio.crossOrigin = "anonymous"; // Helps with CORS on some CDNs
    audioRef.current = audio;

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      // Browsers often block auto-play without user interaction.
      // We try to play, but don't force it if it fails initially.
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    };

    const handleError = (e: any) => {
      const errorDetail = audioRef.current?.error;
      console.warn("AmbientPlayer: Audio source error handled:", {
        code: errorDetail?.code,
        message: errorDetail?.message,
        url
      });
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
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

  const retry = () => {
    if (audioRef.current) {
      setHasError(false);
      setIsLoading(true);
      audioRef.current.load();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={hasError ? retry : togglePlay}
          disabled={isLoading}
          className={`h-12 w-12 rounded-full border-2 border-white shadow-xl backdrop-blur-xl transition-all hover:scale-110 active:scale-95 ${
            isPlaying ? 'bg-primary/20' : 'bg-white/40'
          } ${hasError ? 'border-destructive/50 bg-destructive/10' : ''}`}
        >
          {isLoading ? (
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          ) : hasError ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : isPlaying ? (
            <Volume2 className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white text-[9px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
          {isLoading ? "Loading Soundscape..." : hasError ? "Click to Retry Sound" : isPlaying ? "Ambient: Playing" : "Ambient: Muted"}
        </div>
      </div>
    </div>
  );
}
