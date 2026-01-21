"use client";
import React, { useState, useEffect, useRef } from "react";
import { Music, ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  getVideoData(): { title: string; author: string; video_id: string };
}

interface YTEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: object) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YoutubePlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState("Memuat judul...");
  
  const playerRef = useRef<YTPlayer | null>(null);

  const videoId = "NzEpAx6DIIE"; 

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    const initPlayer = () => {
      if (!window.YT) return;

      playerRef.current = new window.YT.Player("youtube-player-hidden", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: videoId,
        },
        events: {
          onReady: (event: YTEvent) => {
            const data = event.target.getVideoData();
            setVideoTitle(data.title || "Lagu Kita ❤️");
          },
          onStateChange: (event: YTEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      const data = playerRef.current.getVideoData();
      if (data) setVideoTitle(data.title);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
      <div
        className={`transition-all duration-500 ease-in-out transform origin-bottom-right pointer-events-auto ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="bg-white/40 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/50 w-64 mb-3">
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className={`w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            >
              <Music size={30} className="text-white" />
            </div>

            <div className="w-full">
              <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">
                Now Playing
              </p>
              <h4 className="text-sm font-bold text-gray-800 truncate px-2 leading-relaxed">
                {videoTitle}
              </h4>
            </div>

            <button
              onClick={togglePlay}
              className="bg-pink-500 hover:bg-pink-600 text-white w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
              <span className="text-xs font-bold">
                {isPlaying ? "Pause" : "Play Musik"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-2xl flex items-center gap-2 transition-all active:scale-95 border-2 border-white/50"
      >
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        <div className={isPlaying ? "animate-spin" : ""}>
          <Music size={20} />
        </div>
      </button>

      <div id="youtube-player-hidden" className="hidden"></div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default YoutubePlayer;