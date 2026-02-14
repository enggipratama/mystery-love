"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";

const { WORDS, TIME_LIMIT, WORD_COUNT, TITLE } = GAME_CONFIG.LEVEL_6;

const shuffle = (word: string) =>
  word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

const getRandomWords = (words: string[], count: number) => {
  return [...words].sort(() => Math.random() - 0.5).slice(0, count);
};

const LevelSix: React.FC = () => {
  const router = useRouter();

  const [shuffledWords, setShuffledWords] = useState<string[]>(() => 
    getRandomWords(WORDS, WORD_COUNT)
  );
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [input, setInput] = useState("");
  const [isWin, setIsWin] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [shake, setShake] = useState(false);

  const resetFullGame = useCallback(() => {
    setShuffledWords(getRandomWords(WORDS, WORD_COUNT));
    setLevel(0);
    setInput("");
    setTimeLeft(TIME_LIMIT);
    setIsWin(false);
    setShowLosePopup(false);
    setShake(false);
  }, []);

  const word = shuffledWords[level] || "";
  const shuffledWord = useMemo(() => shuffle(word), [word]);

  useEffect(() => {
    if (isWin || showLosePopup || !word) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowLosePopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWin, showLosePopup, level, word]);

  const checkAnswer = useCallback((currentInput: string) => {
    if (currentInput === word) {
      if (level === shuffledWords.length - 1) {
        setIsWin(true);
      } else {
        setTimeout(() => {
          setLevel((prev) => prev + 1);
          setInput("");
          setTimeLeft(TIME_LIMIT);
        }, 400);
      }
    } else {
      setShake(true);
      setTimeout(() => {
        setInput("");
        setShake(false);
      }, 300);
    }
  }, [word, level, shuffledWords.length]);

  const handleLetterClick = useCallback((letter: string) => {
    if (isWin || showLosePopup) return;
    if (input.length >= word.length) return;

    const newInput = input + letter;
    setInput(newInput);

    if (newInput.length === word.length) {
      setTimeout(() => {
        checkAnswer(newInput);
      }, 100);
    }
  }, [input, word.length, isWin, showLosePopup, checkAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWin || showLosePopup) return;
      
      const letter = e.key.toUpperCase();
      if (shuffledWord.includes(letter)) {
        handleLetterClick(letter);
      }
      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
      if (e.key === "r" || e.key === "R") {
        resetFullGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shuffledWord, handleLetterClick, isWin, showLosePopup, resetFullGame]);

  const handleRemove = (index: number) => {
    setInput((prev) => prev.slice(0, index) + prev.slice(index + 1));
  };

  const resetAnswerOnly = () => {
    setInput("");
    setShake(false);
  };

  const handleSuccess = () => {
    setLevelCompleted(6);
    router.push("/level-7");
  };

  const progressPercent = (timeLeft / TIME_LIMIT) * 100;

  return (
    <ProtectedLevel level={6}>
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
          text={isWin ? "Pintar banget sih kamu 💖" : `💖 ${TITLE}`}
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
          {isWin ? "Kamu berhasil menyusun semua kata cinta ❤️" : `Susun huruf menjadi kata yang benar! (${level + 1}/${shuffledWords.length})`}
        </p>

        <div className="flex gap-4 mb-2 text-xs font-semibold text-pink-600 items-center">
          <p>Time: {timeLeft}s</p>
          <p>
            Word: {level + 1}/{shuffledWords.length}
          </p>
        </div>
        <div className="w-full max-w-[260px] h-1.5 bg-pink-100 rounded-full overflow-hidden mb-3 shadow-inner">
          <div
            className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className={`flex flex-wrap gap-1.5 mb-3 justify-center ${
            shake ? "animate-shake" : ""
          }`}
        >
          {Array.from({ length: word.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleRemove(i)}
              className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-base font-bold ${
                input[i]
                  ? "bg-green-200 border-green-400"
                  : "bg-white border-pink-300"
              }`}
              aria-label={`Remove letter ${i + 1}`}
            >
              {input[i] || ""}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center bg-white/40 p-3 rounded-2xl shadow-2xl mb-3 max-w-[280px]">
          {shuffledWord.split("").map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter)}
              className="w-10 h-10 bg-pink-200 hover:bg-pink-300 rounded-lg font-bold text-base shadow-md"
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={isWin ? resetFullGame : resetAnswerOnly}
            className="px-4 py-2 text-xs font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
          >
            {isWin ? "Play Again" : "Reset Jawaban (R)"}
          </button>

          {isWin && (
            <button
              onClick={handleSuccess}
              className="px-4 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl animate-bounce"
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
              <p className="text-xs text-gray-600 mb-3">
                Mulai lagi dari awal ya ❤️
              </p>
              <button
                onClick={resetFullGame}
                className="px-4 py-2 text-xs font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </main>
    </ProtectedLevel>
  );
};

export default LevelSix;
