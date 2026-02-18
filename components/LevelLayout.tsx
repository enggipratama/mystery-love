"use client";

import React from "react";
import Lottie from "lottie-react";
import ProtectedLevel from "./ProtectedLevel";
import ShinyText from "./ShinyText";
import { COLORS } from "@/constants/game";

interface LevelLayoutProps {
  level: number;
  title: string;
  winTitle?: string;
  description: string;
  winDescription?: string;
  isWon: boolean;
  lottieAnimation: object;
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function LevelLayout({
  level,
  title,
  winTitle,
  description,
  winDescription,
  isWon,
  lottieAnimation,
  children,
  scrollable = false,
}: LevelLayoutProps) {
  const containerClass = scrollable ? "level-page-scroll" : "level-page";

  return (
    <ProtectedLevel level={level}>
      <main className={containerClass}>
        <style jsx global>{`
          html, body {
            background-color: ${COLORS.BACKGROUND} !important;
            margin: 0;
            padding: 0;
            overflow: ${scrollable ? 'hidden auto' : 'hidden'};
            width: 100%;
            height: 100%;
          }
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
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
          className="text-center text-xl sm:text-2xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-gray-700 px-4 text-xs mb-2 font-medium opacity-80">
          {isWon && winDescription ? winDescription : description}
        </p>

        {children}
      </main>
    </ProtectedLevel>
  );
}
