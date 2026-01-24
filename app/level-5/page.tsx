"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import Confetti from "react-confetti";
import ShinyText from "@/components/ShinyText";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";

const SafeBox: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const CORRECT_PIN = "0406";

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setLevelCompleted(5);
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
  };

  const clearPin = () => setPin("");

  return (
    <ProtectedLevel level={5}>
      <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] p-4 overflow-hidden relative">
        {mounted && <Confetti numberOfPieces={500} recycle={false} />}

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
            <Lottie animationData={cat} loop autoplay />
          </div>
          <ShinyText
            text={"Safe Box 💖"}
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

          <div
            className={`bg-white p-4 rounded-2xl border-4 ${error ? "border-pink-500 animate-shake" : "border-pink-300"} shadow-xl w-full max-w-xs`}
          >
            <div className="bg-pink-50 p-4 rounded-xl mb-4 border-2 border-pink-200 flex justify-center gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i ? "bg-pink-500 scale-110" : "bg-pink-200"}`}
                />
              ))}
            </div>
            <p className="text-center text-pink-400 text-sm mb-4">
              {error
                ? "Salah mulu luuu cupu!"
                : "Clue: Berhubungan dengan aku wleee!"}
            </p>

            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="w-16 h-16 bg-white hover:bg-pink-100 active:scale-95 text-pink-600 text-xl font-bold rounded-2xl transition-all border-2 border-pink-200 shadow-sm"
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={clearPin}
                  className="w-16 h-16 bg-pink-400 hover:bg-pink-100 active:scale-95 text-pink-100 hover:text-pink-400 font-bold rounded-2xl border-2 border-pink-200 shadow-sm flex items-center justify-center transition-colors"
                >
                  <RiDeleteBack2Fill className="text-2xl" />
                </button>

                <button
                  onClick={() => handleKeyPress("0")}
                  className="w-16 h-16 bg-white hover:bg-pink-100 active:scale-95 text-pink-600 text-xl font-bold rounded-2xl border-2 border-pink-200 shadow-sm"
                >
                  0
                </button>

                <div className="w-16 h-16 font-bold text-pink-400 flex items-center justify-center text-2xl">
                  <FaHeart />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
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
          .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}</style>
      </main>
    </ProtectedLevel>
  );
};

export default SafeBox;
