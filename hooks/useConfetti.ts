"use client";

import { useWindowSize } from "./useWindowSize";
import { ANIMATION_CONFIG } from "@/constants/game";

interface UseConfettiReturn {
  windowSize: { width: number; height: number };
  confettiConfig: {
    numberOfPieces: number;
    recycle: boolean;
    gravity: number;
  };
}

export function useConfetti(): UseConfettiReturn {
  const windowSize = useWindowSize();

  return {
    windowSize,
    confettiConfig: {
      numberOfPieces: ANIMATION_CONFIG.CONFETTI.NUMBER_OF_PIECES,
      recycle: ANIMATION_CONFIG.CONFETTI.RECYCLE,
      gravity: ANIMATION_CONFIG.CONFETTI.GRAVITY,
    },
  };
}
