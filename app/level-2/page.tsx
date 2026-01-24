"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import ProtectedLevel from "@/components/ProtectedLevel";
import { setLevelCompleted } from "@/utils/progress";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_IMAGES = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
];

const createShuffledCards = () => {
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
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initializeGame = useCallback(() => {
    setCards(createShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setDisabled(false);
    setIsGameWon(false);
  }, []);

  const handleCardClick = (index: number) => {
    if (disabled || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;

      if (cards[first].image === cards[second].image) {
        const updatedCards = newCards.map((card) =>
          card.image === cards[first].image
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
  };

  const handleSuccess = () => {
    setLevelCompleted(2);
    router.push("/level-3");
  };

  return (
    <ProtectedLevel level={2}>
      <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
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
          .transform-style-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
        `}</style>

        {isGameWon && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
          />
        )}

        <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isGameWon ? "You Won! ❤️" : "💖 Level 2 — The Memory"}
          speed={2}
          delay={0}
          color="#e60076"
          shineColor="#ffd0e1"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-2xl sm:text-4xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-gray-700 px-4 text-xs sm:text-sm mb-4 font-medium opacity-80">
          {isGameWon
            ? "Yeay! Kamu hebat banget pasangin foto kita! 😍"
            : "Cari pasangan foto kita untuk lanjut ke tahap berikutnya!"}
        </p>

        <div className="bg-white/40 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl border border-white/50 mb-6 w-full max-w-fit">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 justify-items-center">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="relative w-15 h-15 sm:w-15 sm:h-15 cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
                    card.isFlipped || card.isMatched
                      ? "[transform:rotateY(180deg)]"
                      : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg backface-hidden border-2 border-white/40">
                    <span className="text-white text-2xl font-bold">?</span>
                  </div>
                  <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden border-2 border-pink-400 backface-hidden [transform:rotateY(180deg)] shadow-inner">
                    {card.image && (
                      <Image
                        src={card.image}
                        alt="memory"
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <span className="bg-pink-500/20 text-pink-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Moves: {moves}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={initializeGame}
            className="px-6 py-3 text-sm font-bold bg-pink-400 text-white rounded-2xl shadow-lg hover:bg-pink-500 active:scale-95 transition-all"
          >
            Reset
          </button>

          {isGameWon && (
            <button
              onClick={handleSuccess}
              className="px-6 py-3 text-sm font-bold bg-pink-500 text-white rounded-2xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all animate-bounce"
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
