"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import Confetti from "react-confetti";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { COLORS } from "@/constants/game";

interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
}

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const PHOTO_URL = "/images/we.jpeg";

const createShuffledPieces = (): PuzzlePiece[] => {
  const initialPieces = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
    id: i,
    currentPos: i,
    correctPos: i,
  }));
  
  // Shuffle until we get a non-solved arrangement
  let shuffled;
  let attempts = 0;
  do {
    shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    attempts++;
  } while (
    shuffled.every((piece, i) => piece.correctPos === i) && attempts < 10
  );
  
  return shuffled;
};

const LevelFour: React.FC = () => {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  // Reset state when component mounts (handles navigation back to this page)
  useEffect(() => {
    setPieces(createShuffledPieces());
    setIsSolved(false);
    setSelectedPiece(null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shufflePuzzle = useCallback(() => {
    setPieces(createShuffledPieces());
    setIsSolved(false);
    setSelectedPiece(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        shufflePuzzle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

      // Check if puzzle is solved
      const isComplete = newPieces.every((piece, i) => piece.correctPos === i);
      if (isComplete) {
        setTimeout(() => {
          setIsSolved(true);
        }, 300);
      }
    }
  };

  const handleSuccess = () => {
    setLevelCompleted(4);
    router.push("/level-5");
  };

  return (
    <ProtectedLevel level={4}>
      <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
        {isSolved && (
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
          .shake-animation {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isSolved ? "Pintar banget siii! ❤️" : "💖 Level 4 — Puzzle"}
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
          {isSolved
            ? "Kamu berhasil menyatukan kepingan kenangan kita! 😍"
            : "Klik dua kotak untuk menukar posisinya hingga fotonya benar."}
        </p>

        <div
          className="grid gap-0.5 bg-white/40 p-2 rounded-2xl shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: "min(75vw, 260px)",
            height: "min(75vw, 260px)",
          }}
        >
          {pieces.map((piece, index) => {
            const x = (piece.correctPos % GRID_SIZE) * (100 / (GRID_SIZE - 1));
            const y =
              Math.floor(piece.correctPos / GRID_SIZE) * (100 / (GRID_SIZE - 1));

            return (
              <button
                key={piece.id}
                onClick={() => handlePieceClick(index)}
                className={`relative cursor-pointer overflow-hidden rounded-md transition-all duration-300 ${
                  selectedPiece === index
                    ? "ring-2 ring-pink-500 scale-95 z-10"
                    : "hover:opacity-90"
                } ${isSolved ? "ring-0" : ""}`}
                style={{
                  backgroundImage: `url(${PHOTO_URL})`,
                  backgroundSize: `${GRID_SIZE * 100}%`,
                  backgroundPosition: `${x}% ${y}%`,
                }}
              >
                {!isSolved && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center text-[8px] text-white/20">
                    {index + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex gap-3 relative z-10">
          {!isSolved && (
            <button
              onClick={shufflePuzzle}
              className="px-4 py-2 text-xs font-bold bg-pink-400 hover:bg-pink-500 text-white rounded-xl"
            >
              Reset (R)
            </button>
          )}
          {isSolved && (
            <button
              onClick={handleSuccess}
              className="px-6 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl animate-bounce"
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
