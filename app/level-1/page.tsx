"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import cat from "@/public/cat/level-1.json";
import ShinyText from "@/components/ShinyText";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";

export default function LevelOne() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const CORRECT_ANSWER = "2024-11-11";

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = () => {
    if (answer === CORRECT_ANSWER) {
      setIsCorrect(true);
      setShowConfetti(true);
    } else {
      setIsCorrect(false);
      setShowConfetti(false);
      setTimeout(() => setIsCorrect(null), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };
  const handleSuccess = () => {
    setLevelCompleted(1);
    router.push("/level-2");
  };
  return (
    <ProtectedLevel level={1}>
      <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
            style={{ zIndex: 50 }}
          />
        )}

        <style jsx global>{`
          html,
          body {
            background-color: #fbcce1 !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
          .shake-animation {
            animation: shake 0.2s ease-in-out 0s 2;
          }
          input[type="date"] {
            max-width: 100%;
            box-sizing: border-box;
            -webkit-appearance: none;
          }
        `}</style>

        <section className="flex flex-col items-center justify-center mb-6 space-y-4 w-full relative z-10">
          <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
            <Lottie animationData={cat} loop autoplay />
          </div>

          <ShinyText
            text="💖 Level 1"
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
          <p className="text-gray-700 text-sm sm:text-lg font-medium opacity-80 mt-2">
            {isCorrect
              ? "You made me happy!"
              : "Answer correctly to make me happy!"}
          </p>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/30 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl border border-white/40 w-full max-w-[350px] mx-auto relative z-10"
        >
          <AnimatePresence mode="wait">
            {!isCorrect ? (
              <motion.div
                key="question"
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center w-full space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-gray-800 text-xl font-bold italic">
                    Kapan kita jadian?
                  </h2>
                  <p className="text-xs text-pink-500 font-medium">
                    Hayoo inget gak? 🧐
                  </p>
                </div>

                <div className="w-full space-y-4 px-2">
                  <input
                    type="date"
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (isCorrect !== null) setIsCorrect(null);
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full block px-4 py-3 rounded-2xl border-2 transition-all duration-300 outline-none text-center font-bold text-lg
                    ${
                      isCorrect === false
                        ? "border-red-400 bg-red-50 text-red-500 shake-animation"
                        : "border-pink-100 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 text-pink-600 bg-white/80"
                    }`}
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 w-full font-bold bg-pink-500 text-white rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition duration-300"
                  >
                    Kirim Jawaban 💌
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full space-y-6"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="font-extrabold text-pink-600 text-lg px-2">
                    Benar! pinternyaaaa 💖
                  </p>
                </div>

                <button
                  onClick={handleSuccess}
                  className="px-4 py-2 w-full font-bold bg-pink-500 text-white rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition duration-300"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-6 mt-4 flex justify-center">
            <AnimatePresence>
              {isCorrect === false && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500 font-bold italic"
                >
                  Hmm… Masa lupa 😌 Coba lagi ya 💕
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </ProtectedLevel>
  );
}
