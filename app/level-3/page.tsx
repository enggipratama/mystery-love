"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";

const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const START_POS = { x: 1, y: 1 };
const TARGET_POS = { x: 8, y: 8 };

const LevelThree: React.FC = () => {
  const router = useRouter();
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [isGameWon, setIsGameWon] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isGameWon) return;

      setPlayerPos((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;
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
          movePlayer(0, -1);
          break;
        case "s":
          movePlayer(0, 1);
          break;
        case "a":
          movePlayer(-1, 0);
          break;
        case "d":
          movePlayer(1, 0);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const resetGame = () => {
    setPlayerPos(START_POS);
    setIsGameWon(false);
  };
  const handleSuccess = () => {
    setLevelCompleted(3);
    router.push("/level-4");
  };
  return (
    <ProtectedLevel level={3}>
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative px-4">
      <style jsx global>{`
        html,
        body {
          background-color: #fbcce1 !important;
          margin: 0;
          overflow-x: hidden;
          overflow-y: auto;
        }
      `}</style>

      {isGameWon && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
        <Lottie animationData={cat} loop autoplay />
      </div>

      <ShinyText
        text={isGameWon ? "Yeeyy kamu nemuin aku! ❤️" : "💖 Level 3"}
        speed={2}
        delay={0}
        color="#e60076"
        shineColor="#ffd0e1"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
        className="text-center text-2xl sm:text-4xl font-bold mb-1"
      />

      <p className="text-center text-gray-700 text-xs mb-4 opacity-80">
        Gunakan WASD atau tombol panah untuk bertemu!
      </p>

      <div className="bg-white/40 backdrop-blur-md p-3 rounded-3xl shadow-2xl border border-white/50 mb-6">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${MAZE_LAYOUT[0].length}, 1fr)`,
            width: "min(80vw, 300px)",
            height: "min(80vw, 300px)",
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
                  <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">
                    <Image
                      src="/images/1.jpeg"
                      alt="P"
                      fill
                      className="rounded-full border-2 border-pink-300 object-cover"
                    />
                  </div>
                )}
                {TARGET_POS.x === x && TARGET_POS.y === y && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/5.jpeg"
                      alt="T"
                      fill
                      className="rounded-full border-2 border-pink-400 object-cover"
                    />
                  </div>
                )}
              </div>
            )),
          )}
        </div>
      </div>

      {!isGameWon && (
        <div className="grid grid-cols-3 gap-2 mb-6 sm:hidden">
          <div />
          <button
            onClick={() => movePlayer(0, -1)}
            className="p-4 bg-white/60 rounded-xl shadow active:bg-pink-200"
          >
            <FaChevronCircleUp className="text-pink-400" />
          </button>
          <div />
          <button
            onClick={() => movePlayer(-1, 0)}
            className="p-4 bg-white/60 rounded-xl shadow active:bg-pink-200"
          >
            <FaChevronCircleLeft className="text-pink-400" />
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="p-4 bg-white/60 rounded-xl shadow active:bg-pink-200"
          >
            <FaChevronCircleDown className="text-pink-400" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="p-4 bg-white/60 rounded-xl shadow active:bg-pink-200"
          >
            <FaChevronCircleRight className="text-pink-400" />
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {isGameWon && (
          <button
            onClick={resetGame}
            className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
          >
            Reset
          </button>
        )}
        {isGameWon && (
          <button
            onClick={handleSuccess}
            className="px-6 py-2 text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl animate-bounce"
          >
            Continue
          </button>
        )}
      </div>
    </main>
    </ProtectedLevel>
  );
};

export default LevelThree;
