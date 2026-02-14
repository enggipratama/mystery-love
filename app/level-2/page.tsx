"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import cat from "@/public/cat/melet.json";
import Lottie from "lottie-react";
import ShinyText from "@/components/ShinyText";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const { CARD_IMAGES, TITLE } = GAME_CONFIG.LEVEL_2;

const createShuffledCards = (): Card[] => {
  return [...CARD_IMAGES, ...CARD_IMAGES]
    .sort(() => Math.random() - 0.5)
    .map((img, index) => ({
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false,
    }));
};

const LevelTwo: React.FC = () => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(() => createShuffledCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const initializeGame = useCallback(() => {
    setCards(createShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setDisabled(false);
    setIsGameWon(false);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (disabled || cards[index]?.isFlipped || cards[index]?.isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;

      if (newCards[first].image === newCards[second].image) {
        const updatedCards = newCards.map((card) =>
          card.image === newCards[first].image
            ? { ...card, isMatched: true }
            : card,
        );
        setCards(updatedCards);
        setFlippedCards([]);
        setDisabled(false);

        if (updatedCards.every((c) => c.isMatched)) {
          setIsGameWon(true);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card,
            ),
          );
          setFlippedCards([]);
          setDisabled(false);
        }, 700);
      }
    }
  }, [cards, disabled, flippedCards]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= cards.length) {
        handleCardClick(num - 1);
      }
      if (e.key === "r" || e.key === "R") {
        initializeGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards.length, handleCardClick, initializeGame]);

  const handleSuccess = () => {
    setLevelCompleted(2);
    router.push("/level-3");
  };

  return (
    <ProtectedLevel level={2}>
      <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative px-4 overflow-hidden">
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

        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-1">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isGameWon ? "You Won! ❤️" : `💖 ${TITLE}`}
          speed={2}
          delay={0}
          color={COLORS.PRIMARY}
          shineColor={COLORS.SHINE}
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-lg sm:text-xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-gray-700 px-4 text-[10px] sm:text-xs mb-2 font-medium opacity-80">
          {isGameWon ? "Yeay! Kamu hebat banget! 😍" : "Cari pasangan foto kita!"}
        </p>

        <div className="bg-white/40 backdrop-blur-xl p-2 sm:p-3 rounded-2xl shadow-2xl border border-white/50">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5 justify-items-center">
            {cards.map((card, index) => (
               <div
                 key={card.id}
                 onClick={() => handleCardClick(index)}
                 className="relative w-14 h-14 sm:w-16 sm:h-16 cursor-pointer"
                 style={{ perspective: "1000px" }}
               >
                 <div
                   className="relative w-full h-full transition-transform duration-500"
                   style={{
                     transformStyle: "preserve-3d",
                     transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0deg)"
                   }}
                 >
                   <div 
                     className="absolute inset-0 bg-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-white/40"
                     style={{ backfaceVisibility: "hidden" }}
                   >
                     <span className="text-white text-base sm:text-lg font-bold">{index + 1}</span>
                   </div>
                   <div 
                     className="absolute inset-0 bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-pink-400 shadow-inner"
                     style={{ 
                       backfaceVisibility: "hidden",
                       transform: "rotateY(180deg)"
                     }}
                   >
                      {card.image && (
                        <img
                          src={card.image}
                          alt={`Memory card ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", card.image);
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                   </div>
                 </div>
               </div>
            ))}
          </div>

          <div className="mt-1.5 text-center">
            <span className="bg-pink-500/20 text-pink-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Moves: {moves}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={initializeGame}
            className="px-3 py-1.5 text-xs font-bold bg-pink-400 text-white rounded-lg shadow-lg hover:bg-pink-500 active:scale-95 transition-all"
          >
            Reset (R)
          </button>

          {isGameWon && (
            <button
              onClick={handleSuccess}
              className="px-3 py-1.5 text-xs font-bold bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 active:scale-95 transition-all animate-bounce"
            >
              Continue
            </button>
          )}
        </div>
      </main>
    </ProtectedLevel>
  );
};

export default LevelTwo;
