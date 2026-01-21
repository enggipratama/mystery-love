"use client";

import { useState } from "react";
import Image from "next/image";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}
const CARD_IMAGES = [
  "/images/foto-1.jpg",
  "/images/foto-2.jpg",
  "/images/foto-3.jpg",
  "/images/foto-4.jpg",
];

const generateCards = (): Card[] => {
  return [...CARD_IMAGES, ...CARD_IMAGES]
    .sort(() => Math.random() - 0.5)
    .map((img, index) => ({
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false,
    }));
};

export default function VisualMatch() {
  const [cards, setCards] = useState<Card[]>(() => generateCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    setDisabled(false);
  };

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
        setCards((prev) =>
          prev.map((card) =>
            card.image === cards[first].image
              ? { ...card, isMatched: true }
              : card,
          ),
        );
        setFlippedCards([]);
        setDisabled(false);
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
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex justify-between w-full mb-6 items-center px-2">
        <div className="text-sm font-medium bg-white/10 px-4 py-1 rounded-full text-white">
          Moves: <span className="text-pink-400">{moves}</span>
        </div>
        <button
          onClick={resetGame}
          className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-full transition-all active:scale-90 font-bold uppercase tracking-wider"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className="group relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            <div
              className={`relative w-full h-full transition-all duration-500 transform-style-3d ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center border border-white/20 shadow-lg backface-hidden">
                <div className="w-6 h-6 border-2 border-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white/40 text-[10px]">?</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-white rounded-xl overflow-hidden border-2 border-pink-400 shadow-xl rotate-y-180 backface-hidden">
                <Image
                  src={card.image}
                  alt="icon"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length > 0 && cards.every((c) => c.isMatched) && (
        <div className="mt-6 text-center animate-bounce">
          <p className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Perfect Match! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
