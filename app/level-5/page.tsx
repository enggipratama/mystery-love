"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";
import { FaCat, FaBomb, FaHeart, FaHeartBroken, FaClock } from "react-icons/fa";

const { BOX_COUNT, TIME_LIMIT, TARGET_SCORE, MAX_LIVES, TITLE } = GAME_CONFIG.LEVEL_5;

const LevelFive: React.FC = () => {
  const router = useRouter();
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [bombBox, setBombBox] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isWin, setIsWin] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [flashType, setFlashType] = useState<"cat" | "bomb" | null>(null);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(MAX_LIVES);
    setTimeLeft(TIME_LIMIT);
    setIsWin(false);
    setActiveBox(null);
    setBombBox(null);
    setShowLosePopup(false);
    setShakeIndex(null);
    setFlashIndex(null);
    setFlashType(null);
    setIsPlaying(false);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setIsPlaying(true);
  }, [resetGame]);

  useEffect(() => {
    if (!isPlaying || isWin || showLosePopup) return;

    const moveInterval = setInterval(() => {
      const newCat = Math.floor(Math.random() * BOX_COUNT);
      let newBomb = Math.floor(Math.random() * BOX_COUNT);
      while (newBomb === newCat) {
        newBomb = Math.floor(Math.random() * BOX_COUNT);
      }
      setActiveBox(newCat);
      setBombBox(newBomb);
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [isPlaying, isWin, showLosePopup]);

  useEffect(() => {
    if (!isPlaying || isWin || showLosePopup) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowLosePopup(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isWin, showLosePopup]);

  const triggerShake = useCallback((index: number) => {
    setShakeIndex(index);
    setShakeKey((k) => k + 1);
    setTimeout(() => setShakeIndex(null), 300);
  }, []);

  const handleBoxClick = useCallback((index: number) => {
    if (!isPlaying || isWin || timeLeft <= 0 || showLosePopup) return;

    if (index === bombBox) {
      setFlashIndex(index);
      setFlashType("bomb");
      triggerShake(index);

      setLives((prev) => {
        const newLives = Math.max(prev - 1, 0);
        if (newLives === 0) {
          setShowLosePopup(true);
          setIsPlaying(false);
        }
        return newLives;
      });

      setTimeout(() => {
        setFlashIndex(null);
        setFlashType(null);
      }, 300);
      return;
    }

    if (index === activeBox) {
      setFlashIndex(index);
      setFlashType("cat");

      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= TARGET_SCORE) {
          setIsWin(true);
          setIsPlaying(false);
        }
        return newScore;
      });

      setActiveBox(null);

      setTimeout(() => {
        setFlashIndex(null);
        setFlashType(null);
      }, 300);
      return;
    }

    triggerShake(index);
  }, [isPlaying, isWin, timeLeft, showLosePopup, bombBox, activeBox, triggerShake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= BOX_COUNT) {
        handleBoxClick(num - 1);
      }
      if (e.key === " " || e.key === "Enter") {
        if (!isPlaying && !isWin && !showLosePopup) {
          startGame();
        }
      }
      if (e.key === "r" || e.key === "R") {
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isWin, showLosePopup, handleBoxClick, startGame, resetGame]);

  const handleSuccess = () => {
    setLevelCompleted(5);
    router.push("/level-6");
  };

  const progressPercent = (timeLeft / TIME_LIMIT) * 100;

  return (
    <ProtectedLevel level={5}>
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
          text={isWin ? "Sayang Hebat banget! 😻" : `💖 ${TITLE}`}
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
          {isWin ? "Kamu berhasil menangkap kucingnya! 😍" : "Tangkap Kucing dan hindari BOM!"}
        </p>

        <div className="bg-white/40 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/50 w-full max-w-fit">
          <p className="text-center text-gray-600 text-xs mb-2 px-2">
            <span className="flex justify-center items-center gap-2">
              Tangkap <FaCat className="text-pink-500" /> dan hindari{" "}
              <FaBomb className="text-gray-700" />
            </span>
          </p>

          <div className="flex gap-4 mb-2 text-xs font-semibold text-pink-600 items-center justify-center">
            <p>Score: {score}</p>
            <p>Target: {TARGET_SCORE}</p>

            <div className="flex items-center gap-1">
              <span>Lives:</span>
              {Array.from({ length: lives }).map((_, i) => (
                <FaHeart
                  key={i}
                  className="text-red-500 text-xs animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="w-full max-w-[240px] h-1.5 bg-pink-100 rounded-full overflow-hidden mb-3 shadow-inner mx-auto">
            <div
              className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 justify-items-center">
            {Array.from({ length: BOX_COUNT }).map((_, index) => (
              <div
                key={`${index}-${shakeKey}-${shakeIndex === index ? "shake" : "normal"}`}
                onClick={() => handleBoxClick(index)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 cursor-pointer rounded-xl shadow-md flex items-center justify-center text-xl transition 
                  ${shakeIndex === index ? "animate-shake" : ""}
                  ${
                    flashIndex === index && flashType === "bomb"
                      ? "bg-red-400"
                      : flashIndex === index && flashType === "cat"
                        ? "bg-green-200"
                        : "bg-white hover:bg-pink-50"
                  }
                `}
              >
                {activeBox === index && (
                  <FaCat className="text-blue-500 text-lg drop-shadow-lg animate-bounce" />
                )}
                {bombBox === index && (
                  <FaBomb className="text-gray-700 text-lg drop-shadow-lg animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          {!isPlaying && !isWin && (
            <button
              onClick={startGame}
              className="px-4 py-2 text-xs font-bold bg-pink-400 text-white rounded-xl shadow-lg hover:bg-pink-500 active:scale-95 transition-all"
            >
              Play (Space)
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-2 text-xs font-bold bg-pink-400 text-white rounded-xl shadow-lg hover:bg-pink-500 active:scale-95 transition-all"
          >
            Reset (R)
          </button>

          {isWin && (
            <button
              onClick={handleSuccess}
              className="px-4 py-2 text-xs font-bold bg-pink-500 text-white rounded-xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all animate-bounce"
            >
              Continue
            </button>
          )}
        </div>

        {showLosePopup && !isWin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl p-5 w-[85%] max-w-[260px] text-center animate-scalePulse">
              <p className="text-lg font-bold text-pink-600 mb-1">
                Kamu Kalah, Cupu!
              </p>
              <p className="text-xs text-gray-600 mb-3 flex justify-center items-center gap-2">
                {lives <= 0 ? (
                  <>
                    <FaHeartBroken className="text-red-500" />
                    <span>Kena bom! Nyawamu habis</span>
                  </>
                ) : (
                  <>
                    <FaClock className="text-gray-700" />
                    <span>Waktu habis!</span>
                  </>
                )}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={startGame}
                  className="px-4 py-2 text-xs font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedLevel>
  );
};

export default LevelFive;
