"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lottie from "lottie-react";

import cat from "@/public/cat/count.json";
import ShinyText from "@/components/ShinyText";

interface Props {
  targetDate: string;
  children?: React.ReactNode;
  blockAccess?: boolean;
}

export default function CountdownGuard({
  targetDate,
  children,
  blockAccess = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const getRemaining = () =>
    Math.max(0, new Date(targetDate).getTime() - Date.now());

  const [timeLeft, setTimeLeft] = useState(getRemaining);
  const [redirectReady, setRedirectReady] = useState(getRemaining() === 0);
  const [isFinalMode, setIsFinalMode] = useState(
    getRemaining() <= 16 && getRemaining() > 0,
  );
  const [finalSeconds, setFinalSeconds] = useState(() => {
    const r = getRemaining();
    return r <= 15 && r > 0 ? Math.ceil(r / 1000) : null;
  });
  const [showCurtain, setShowCurtain] = useState(
    getRemaining() <= 15 && getRemaining() > 0,
  );
  const [curtainOpening, setCurtainOpening] = useState(false);
  const [currentTargetDate, setCurrentTargetDate] = useState(targetDate);

  // Monitor target date changes and reset state
  useEffect(() => {
    if (targetDate !== currentTargetDate) {
      setCurrentTargetDate(targetDate);
      const newRemaining = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setTimeLeft(newRemaining);
      setRedirectReady(newRemaining === 0);
      setIsFinalMode(newRemaining <= 16 && newRemaining > 0);
      setFinalSeconds(newRemaining <= 15 && newRemaining > 0 ? Math.ceil(newRemaining / 1000) : null);
      setShowCurtain(newRemaining <= 15 && newRemaining > 0);
      setCurtainOpening(newRemaining === 0);
    }
  }, [targetDate, currentTargetDate]);

  useEffect(() => {
    if (redirectReady) return;

    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(target - now, 0);
      const secondsLeft = Math.ceil(distance / 1000);

      setTimeLeft(distance);

      if (secondsLeft <= 16 && secondsLeft > 0 && !isFinalMode) {
        setIsFinalMode(true);
        setShowCurtain(true);
        setFinalSeconds(secondsLeft);
      }

      if (isFinalMode && secondsLeft > 0 && secondsLeft <= 16) {
        setFinalSeconds(secondsLeft);
      }

      if (secondsLeft === 0 && !redirectReady) {
        setFinalSeconds(null);
        setCurtainOpening(true);

        setTimeout(() => setRedirectReady(true), 1600);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isFinalMode, redirectReady]);

  useEffect(() => {
    if (blockAccess && !redirectReady && pathname !== "/") {
      router.replace("/");
    }
  }, [blockAccess, redirectReady, pathname, router]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}m ${seconds}s`;
  };

  const getDateText = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (blockAccess && !redirectReady) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#fbcce1] px-4">
        {!isFinalMode && (
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="h-30 w-30 sm:h-40 sm:w-40">
              <Lottie animationData={cat} loop autoplay />
            </div>
            <ShinyText
              text="Tunggu dulu Yaa..."
              speed={2}
              color="#e60076"
              shineColor="#ffd0e1"
              className="mb-2 text-center text-2xl font-bold sm:text-4xl"
            />
            <div className="rounded-xl bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 px-6 py-2 font-mono text-2xl tracking-wide text-white shadow-xl sm:text-3xl">
              {formatTime(timeLeft)}
            </div>
            <div className="mt-4 rounded-full bg-white/30 px-4 py-1 text-sm font-semibold text-pink-600 sm:text-base">
              Hari Spesial: <strong>{getDateText(targetDate)} 🎉</strong>
            </div>
          </div>
        )}

        {showCurtain && (
          <div
            className={`fixed inset-0 z-40 bg-[#fbcce1] ${
              curtainOpening ? "animate-curtainUp" : "animate-curtainDown"
            }`}
          />
        )}

        {finalSeconds !== null && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div
              key={finalSeconds}
              className="animate-heartBeat text-8xl font-extrabold text-pink-400 drop-shadow-xl sm:text-9xl"
            >
              {finalSeconds}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
