"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ShinyText from "@/components/ShinyText";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";
import Confetti from "react-confetti";

const WORDS = [
  "AKU",
  "KAMU",
  "CINTA",
  "SAYANG",
  "KASIH",
  "RINDU",
  "JODOH",
  "SETIA",
  "HATI",
  "HUBUNGAN",
  "JANJI",
  "DOA",
  "MESRA",
  "BAHAGIA",
  "DEKAT",
  "PELUK",
  "KOMITMEN",
  "ROMANTIS",
  "PENGERTIAN",
  "KEBERSAMAAN",
];

const TIME_LIMIT = 30;

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
    getRandomWords(WORDS, 10),
  );

  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [input, setInput] = useState("");
  const [isWin, setIsWin] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [shake, setShake] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const word = shuffledWords[level];
  const shuffledWord = useMemo(() => shuffle(word), [word]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isWin || showLosePopup) return;

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
  }, [isWin, showLosePopup, level]);

  const checkAnswer = (currentInput: string) => {
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
  };

  const handleLetterClick = (letter: string) => {
    if (isWin || showLosePopup) return;
    if (input.length >= word.length) return;

    const newInput = input + letter;
    setInput(newInput);

    if (newInput.length === word.length) {
      setTimeout(() => {
        checkAnswer(newInput);
      }, 100);
    }
  };

  const handleRemove = (index: number) => {
    setInput((prev) => prev.slice(0, index) + prev.slice(index + 1));
  };

  const resetAnswerOnly = () => {
    setInput("");
    setShake(false);
  };

  const resetFullGame = () => {
    setShuffledWords(getRandomWords(WORDS, 10));
    setLevel(0);
    setInput("");
    setTimeLeft(TIME_LIMIT);
    setIsWin(false);
    setShowLosePopup(false);
    setShake(false);
  };

  const handleSuccess = () => {
    setLevelCompleted(6);
    router.push("/level-7");
  };

  const progressPercent = (timeLeft / TIME_LIMIT) * 100;

  return (
    <ProtectedLevel level={6}>
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
          text={
            isWin ? "Pintar banget sih kamu 💖  " : "💖 Level 6 — Susun Kata"
          }
          speed={2}
          color="#e60076"
          shineColor="#ffd0e1"
          className="text-center text-2xl sm:text-4xl font-bold mb-2"
        />

        <p className="text-center text-gray-600 text-xs mb-3 px-4">
          {isWin
            ? "Kamu berhasil menyusun semua kata cinta ❤️"
            : `Susun huruf menjadi kata yang benar! (${level + 1}/${shuffledWords.length})`}
        </p>
        <div className="flex gap-6 mb-3 text-sm font-semibold text-pink-600 items-center">
          <p>Time: {timeLeft}s</p>
          <p>
            Word: {level + 1}/{shuffledWords.length}
          </p>
        </div>
        <div className="w-full max-w-sm h-2 bg-pink-100 rounded-full overflow-hidden mb-3 shadow-inner">
          <div
            className="h-full bg-pink-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className={`flex flex-wrap gap-2 mb-4 justify-center ${
            shake ? "animate-shake" : ""
          }`}
        >
          {Array.from({ length: word.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleRemove(i)}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold ${
                input[i]
                  ? "bg-green-200 border-green-400"
                  : "bg-white border-pink-300"
              }`}
            >
              {input[i] || ""}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center bg-white/40 p-3 rounded-2xl shadow-2xl mb-4">
          {shuffledWord.split("").map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter)}
              className="w-12 h-12 bg-pink-200 hover:bg-pink-300 rounded-xl font-bold text-lg shadow-md"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={isWin ? resetFullGame : resetAnswerOnly}
            className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
          >
            {isWin ? "Play Again" : "Reset Jawaban"}
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
              <p className="text-sm text-gray-600 mb-4">
                Mulai lagi dari awal ya ❤️
              </p>
              <button
                onClick={resetFullGame}
                className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
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
