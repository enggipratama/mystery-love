"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isLoading } = useLoading();
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFadingRef = useRef(false);

  const stopFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    isFadingRef.current = false;
  }, []);

  const fadeIn = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const step = 0.05;
    const fadeDuration = 1500;
    const intervalTime = fadeDuration / (1 / step);
    
    audio.volume = 0;
    audio.play();
    isFadingRef.current = true;
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(audio.volume + step, 1);
      } else {
        stopFade();
      }
    }, intervalTime);
  }, [stopFade]);

  useEffect(() => {
    const handleCountdownFinished = () => {
      if (audioRef.current) {
        fadeIn();
        setIsPlaying(true);
      }
    };

    window.addEventListener('countdownFinished', handleCountdownFinished);

    return () => {
      window.removeEventListener('countdownFinished', handleCountdownFinished);
      stopFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.volume = 1;
      }
    };
  }, [fadeIn, stopFade]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    stopFade();

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.volume = 1;
    } else {
      fadeIn();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, fadeIn, stopFade]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <audio
        ref={audioRef}
        src="/audio/music.mp3"
        loop
        onEnded={() => setIsPlaying(false)}
      />
      {!isLoading && (
        <button
          onClick={togglePlay}
          className="bg-pink-500 hover:bg-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-2 border-white/50"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;
