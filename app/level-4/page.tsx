"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";

interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
}

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const PHOTO_URL = "/images/we.jpeg";

const LevelFour: React.FC = () => {
  const router = useRouter();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const shufflePuzzle = useCallback(() => {
    const initialPieces = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i,
    }));
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setIsSolved(false);
    setSelectedPiece(null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const timeoutId = setTimeout(() => {
      shufflePuzzle();
    }, 0);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [shufflePuzzle]);

  const handlePieceClick = (index: number) => {
    if (isSolved) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      const newPieces = [...pieces];
      const temp = newPieces[selectedPiece];
      newPieces[selectedPiece] = newPieces[index];
      newPieces[index] = temp;

      setPieces(newPieces);
      setSelectedPiece(null);

      const solved = newPieces.every((piece, i) => piece.correctPos === i);
      if (solved) setIsSolved(true);
    }
  };
  const handleSuccess = () => {
      setLevelCompleted(4);
      router.push("/level-5");
    };

  return (
    <ProtectedLevel level={4}>
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] p-4 overflow-hidden relative">
      {isSolved && (
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
        text={isSolved ? "Pintar banget siii! ❤️" : "💖 Level 4"}
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

      <p className="text-center text-gray-600 text-xs mb-4 px-4">
        {isSolved
          ? "Kamu berhasil menyatukan kepingan kenangan kita! 😍"
          : "Klik dua kotak untuk menukar posisinya hingga fotonya benar."}
      </p>

      <div
        className="grid gap-1 bg-white/40 p-2 rounded-2xl shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: "min(90vw, 350px)",
          height: "min(90vw, 350px)",
        }}
      >
        {pieces.map((piece, index) => {
          const x = (piece.correctPos % GRID_SIZE) * (100 / (GRID_SIZE - 1));
          const y =
            Math.floor(piece.correctPos / GRID_SIZE) * (100 / (GRID_SIZE - 1));

          return (
            <div
              key={piece.id}
              onClick={() => handlePieceClick(index)}
              className={`relative cursor-pointer overflow-hidden rounded-md transition-all duration-300 ${
                selectedPiece === index
                  ? "ring-4 ring-pink-500 scale-95 z-10"
                  : "hover:opacity-90"
              } ${isSolved ? "ring-0" : ""}`}
              style={{
                backgroundImage: `url(${PHOTO_URL})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `${x}% ${y}%`,
              }}
            >
              {!isSolved && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center text-[10px] text-white/20">
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={shufflePuzzle}
          className="px-6 py-2 text-sm font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
        >
          Reset
        </button>
        {isSolved && (
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

export default LevelFour;
