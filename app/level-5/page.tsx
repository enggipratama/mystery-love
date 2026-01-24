"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";
import { FaCat, FaBomb, FaHeart, FaHeartBroken, FaClock } from "react-icons/fa";

const BOX_COUNT = 16;
const TIME_LIMIT = 15;
const TARGET_SCORE = 10;
const MAX_LIVES = 3;

const LevelFive: React.FC = () => {
  const router = useRouter();
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [bombBox, setBombBox] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isWin, setIsWin] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [flashType, setFlashType] = useState<"cat" | "bomb" | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const triggerShake = (index: number) => {
    setShakeIndex(index);
    setShakeKey((k) => k + 1);
    setTimeout(() => setShakeIndex(null), 300);
  };

  const handleBoxClick = (index: number) => {
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
  };

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

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const handleSuccess = () => {
    setLevelCompleted(5);
    router.push("/level-6");
  };

  const progressPercent = (timeLeft / TIME_LIMIT) * 100;

  return (
    <ProtectedLevel level={5}>
      <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] p-4 overflow-hidden relative">
        {isWin && (
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
          text={isWin ? "Sayang Hebat banget! 😻" : "💖 Level 5 — Catch Cat"}
          speed={2}
          delay={0}
          color="#e60076"
          shineColor="#ffd0e1"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-2xl sm:text-4xl font-bold mb-2"
        />

        <p className="text-center text-gray-600 text-xs mb-3 px-4">
          {isWin ? (
            "Kamu berhasil menangkap kucingnya! 😍"
          ) : (
            <span className="flex justify-center items-center gap-2">
              Tangkap Kucing <FaCat className="text-pink-500" /> dan hindari BOM{" "}
              <FaBomb className="text-gray-700" />
            </span>
          )}
        </p>
        <div className="flex gap-6 mb-4 mt-4 text-sm font-semibold text-pink-600 items-center">
          <p>Score: {score}</p>
          <p>Target: {TARGET_SCORE}</p>

          <div className="flex items-center gap-1">
            <span>Lives:</span>
            {Array.from({ length: lives }).map((_, i) => (
              <FaHeart
                key={i}
                className="text-red-500 text-base animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm h-2 bg-pink-100 rounded-full overflow-hidden mb-3 shadow-inner">
          <div
            className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className="grid grid-cols-4 gap-3 bg-white/40 p-3 rounded-2xl shadow-2xl"
          style={{ width: "min(90vw, 300px)" }}
        >
          {Array.from({ length: BOX_COUNT }).map((_, index) => (
            <button
              key={`${index}-${shakeKey}-${shakeIndex === index ? "shake" : "normal"}`}
              onClick={() => handleBoxClick(index)}
              className={`relative aspect-square rounded-xl shadow-md flex items-center justify-center text-3xl transition 
                ${shakeIndex === index ? "animate-shake" : ""}
                ${
                  flashIndex === index && flashType === "bomb"
                    ? "bg-red-400"
                    : flashIndex === index && flashType === "cat"
                      ? "bg-green-200"
                      : "bg-white hover:bg-pink-50"
                }
              `}
              disabled={!isPlaying}
            >
              {activeBox === index && (
                <FaCat className="text-blue-500 text-3xl drop-shadow-lg animate-bounce" />
              )}
              {bombBox === index && (
                <FaBomb className="text-gray-700 text-3xl drop-shadow-lg animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          {!isPlaying && !isWin && (
            <button
              onClick={startGame}
              className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
            >
              Play
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
          >
            Reset
          </button>

          {isWin && (
            <button
              onClick={handleSuccess}
              className="px-6 py-2 text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl animate-bounce"
            >
              Continue
            </button>
          )}
        </div>
        {showLosePopup && !isWin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-scalePulse">
              <p className="text-xl font-bold text-pink-600 mb-2">
                Kamu Kalah, Cupu!
              </p>
              <p className="text-sm text-gray-600 mb-4 flex justify-center items-center gap-2">
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
              <div className="flex justify-center gap-4">
                <button
                  onClick={startGame}
                  className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
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
