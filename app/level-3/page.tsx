"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";

const { MAZE_LAYOUT, START_POS, TARGET_POS, TITLE } = GAME_CONFIG.LEVEL_3;

interface Position {
  x: number;
  y: number;
}

const LevelThree: React.FC = () => {
  const router = useRouter();
  const [playerPos, setPlayerPos] = useState<Position>({ x: START_POS.x, y: START_POS.y });
  const [isGameWon, setIsGameWon] = useState(false);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isGameWon) return;

      setPlayerPos((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
        
        if (newY < 0 || newY >= MAZE_LAYOUT.length || newX < 0 || newX >= MAZE_LAYOUT[0].length) {
          return prev;
        }
        
        if (MAZE_LAYOUT[newY][newX] === 1) return prev;

        if (newX === TARGET_POS.x && newY === TARGET_POS.y) {
          setIsGameWon(true);
        }

        return { x: newX, y: newY };
      });
    },
    [isGameWon],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          movePlayer(0, -1);
          break;
        case "s":
        case "arrowdown":
          movePlayer(0, 1);
          break;
        case "a":
        case "arrowleft":
          movePlayer(-1, 0);
          break;
        case "d":
        case "arrowright":
          movePlayer(1, 0);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const handleSuccess = () => {
    setLevelCompleted(3);
    router.push("/level-4");
  };

  return (
    <ProtectedLevel level={3}>
      <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
        <style jsx global>{`
          html, body {
            background-color: ${COLORS.BACKGROUND} !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isGameWon ? "Yeeyy kamu nemuin aku! ❤️" : `💖 ${TITLE}`}
          speed={2}
          delay={0}
          color={COLORS.PRIMARY}
          shineColor={COLORS.SHINE}
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-xl sm:text-2xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-gray-700 px-4 text-xs mb-2 font-medium opacity-80">
          {isGameWon ? "Kamu berhasil menemukan aku! 🎉" : "Gunakan WASD atau tombol panah untuk bertemu!"}
        </p>

        <div className="bg-white/40 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/50 mb-2">
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${MAZE_LAYOUT[0].length}, 1fr)`,
              width: "min(75vw, 260px)",
              height: "min(75vw, 260px)",
            }}
          >
            {MAZE_LAYOUT.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`relative rounded-sm transition-all duration-200 ${
                    cell === 1 ? "bg-pink-400 shadow-inner" : "bg-white/50"
                  }`}
                >
                  {playerPos.x === x && playerPos.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center text-lg">
                      <Image
                        src="/images/1.jpeg"
                        alt="Player"
                        fill
                        className="rounded-full border border-pink-300 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {TARGET_POS.x === x && TARGET_POS.y === y && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/images/5.jpeg"
                        alt="Target"
                        fill
                        className="rounded-full border border-pink-400 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </div>

        {!isGameWon && (
          <div className="grid grid-cols-3 gap-1.5 mt-3 mb-2 sm:hidden">
            <div />
            <button
              onClick={() => movePlayer(0, -1)}
              className="p-3 bg-white/60 rounded-lg shadow active:bg-pink-200"
              aria-label="Move up"
            >
              <FaChevronCircleUp className="text-pink-400 text-sm" />
            </button>
            <div />
            <button
              onClick={() => movePlayer(-1, 0)}
              className="p-3 bg-white/60 rounded-lg shadow active:bg-pink-200"
              aria-label="Move left"
            >
              <FaChevronCircleLeft className="text-pink-400 text-sm" />
            </button>
            <button
              onClick={() => movePlayer(0, 1)}
              className="p-3 bg-white/60 rounded-lg shadow active:bg-pink-200"
              aria-label="Move down"
            >
              <FaChevronCircleDown className="text-pink-400 text-sm" />
            </button>
            <button
              onClick={() => movePlayer(1, 0)}
              className="p-3 bg-white/60 rounded-lg shadow active:bg-pink-200"
              aria-label="Move right"
            >
              <FaChevronCircleRight className="text-pink-400 text-sm" />
            </button>
          </div>
        )}

        {isGameWon && (
          <div className="flex gap-3 flex-wrap justify-center mt-3">
            <button
              onClick={handleSuccess}
              className="px-4 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl animate-bounce"
            >
              Continue
            </button>
          </div>
        )}
      </main>
    </ProtectedLevel>
  );
};

export default LevelThree;
