"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";

const { PIN_LENGTH, TITLE } = GAME_CONFIG.LEVEL_7;
const CORRECT_PIN = process.env.NEXT_PUBLIC_LEVEL_7_PIN || "0406";

const SafeBox: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleKeyPress = useCallback((num: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        if (newPin === CORRECT_PIN) {
          setLevelCompleted(7);
          router.push("/gift");
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 600);
        }
      }
    }
  }, [pin, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        setPin((prev) => prev.slice(0, -1));
      }
      if (e.key === "Escape") {
        setPin("");
        setError(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const clearPin = () => setPin("");

  return (
    <ProtectedLevel level={7}>
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
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={`💖 ${TITLE}`}
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

        <p className="text-center max-w-md text-gray-700 px-4 text-xs mb-3 font-medium opacity-80">
          Clue: Berhubungan dengan aku wleee!
        </p>

        <div
          className={`bg-white p-3 rounded-2xl border-4 ${error ? "border-pink-500 animate-shake" : "border-pink-300"} shadow-xl w-full max-w-[260px]`}
        >
          <div className="bg-pink-50 p-3 rounded-xl mb-3 border-2 border-pink-200 flex justify-center gap-2">
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${pin.length > i ? "bg-pink-500 scale-110" : "bg-pink-200"}`}
                aria-label={pin.length > i ? "PIN digit entered" : "PIN digit empty"}
              />
            ))}
          </div>
          <p className="text-center text-pink-400 text-xs mb-3">
            {error
              ? "Salah mulu luuu cupu!"
              : "Masukkan PIN 4 digit"}
          </p>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="w-12 h-12 bg-white hover:bg-pink-100 active:scale-95 text-pink-600 text-lg font-bold rounded-xl transition-all border-2 border-pink-200 shadow-sm"
                  aria-label={`Number ${num}`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={clearPin}
                className="w-12 h-12 bg-pink-400 hover:bg-pink-100 active:scale-95 text-pink-100 hover:text-pink-400 font-bold rounded-xl border-2 border-pink-200 shadow-sm flex items-center justify-center transition-colors"
                aria-label="Clear"
              >
                <RiDeleteBack2Fill className="text-lg" />
              </button>

              <button
                onClick={() => handleKeyPress("0")}
                className="w-12 h-12 bg-white hover:bg-pink-100 active:scale-95 text-pink-600 text-lg font-bold rounded-xl border-2 border-pink-200 shadow-sm"
                aria-label="Number 0"
              >
                0
              </button>

              <div className="w-12 h-12 font-bold text-pink-400 flex items-center justify-center text-xl">
                <FaHeart />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-3">
          Tekan angka keyboard atau klik tombol
        </p>
      </main>
    </ProtectedLevel>
  );
};

export default SafeBox;
