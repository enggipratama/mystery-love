"use client";

import React from "react";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import { useConfetti } from "@/hooks/useConfetti";
import ShinyText from "@/components/ShinyText";
import ProtectedLevel from "@/components/ProtectedLevel";
import { COLORS } from "@/constants/game";

interface GameContainerProps {
  level: number;
  title: string;
  winTitle?: string;
  description: string;
  winDescription?: string;
  isWon: boolean;
  lottieAnimation: object;
  children: React.ReactNode;
  showConfetti?: boolean;
}

export default function GameContainer({
  level,
  title,
  winTitle,
  description,
  winDescription,
  isWon,
  lottieAnimation,
  children,
  showConfetti = true,
}: GameContainerProps) {
  const { windowSize, confettiConfig } = useConfetti();

  return (
    <ProtectedLevel level={level}>
      <main className="min-h-dvh w-full flex flex-col items-center bg-[#fbcce1] relative overflow-x-hidden overflow-y-auto px-4 pt-6 pb-8">
        {isWon && showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={confettiConfig.recycle}
            numberOfPieces={confettiConfig.numberOfPieces}
            gravity={confettiConfig.gravity}
            style={{ zIndex: 50 }}
          />
        )}

        <style jsx global>{`
          html,
          body {
            background-color: ${COLORS.BACKGROUND} !important;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            overflow-y: auto;
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
          input[type="text"]::placeholder {
            color: #f9a8d4;
            font-weight: 400;
          }
          /* Hide date input placeholder text */
          input[type="date"] {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]:invalid {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]:invalid::-webkit-datetime-edit {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]:invalid::-webkit-datetime-edit-text,
          input[type="date"]:invalid::-webkit-datetime-edit-month-field,
          input[type="date"]:invalid::-webkit-datetime-edit-day-field,
          input[type="date"]:invalid::-webkit-datetime-edit-year-field {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
        `}</style>

        <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
          <Lottie animationData={lottieAnimation} loop autoplay />
        </div>

        <ShinyText
          text={isWon && winTitle ? winTitle : `💖 ${title}`}
          speed={2}
          delay={0}
          color={COLORS.PRIMARY}
          shineColor={COLORS.SHINE}
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-2xl sm:text-4xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-gray-700 px-4 text-xs sm:text-sm mb-4 font-medium opacity-80">
          {isWon && winDescription ? winDescription : description}
        </p>

        {children}
      </main>
    </ProtectedLevel>
  );
}
