"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/count.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";

interface Props {
  targetDate: string;
  redirectTo?: string;
  children?: React.ReactNode;
  blockAccess?: boolean;
}

export default function CountdownGuard({
  targetDate,
  redirectTo = "/",
  children,
  blockAccess = true,
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(handle);
  }, []);
  useEffect(() => {
    if (!mounted) return;

    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = Math.max(target - now, 0);
      setTimeLeft(distance);

      if (distance === 0) {
        setShowConfetti(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, targetDate]);

  useEffect(() => {
    if (!mounted) return;
    if (blockAccess && timeLeft === 0) {
      router.replace(redirectTo);
    }
  }, [timeLeft, mounted, router, blockAccess, redirectTo]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}m ${seconds}s`;
  };
  const getDateText = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  if (!mounted) return null;

  if (blockAccess && timeLeft > 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 via-rose-100 to-pink-300 text-white z-50">
        <div className="w-30 h-30 sm:w-40 sm:h-40">
          <Lottie animationData={cat} loop autoplay />
        </div>
        <ShinyText
          text="Please Wait..."
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
        <div className="px-6 py-4 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 rounded-2xl shadow-xl text-2xl sm:text-3xl font-mono text-white tracking-wide">
          {formatTime(timeLeft)}
        </div>
        <div className="text-pink-600 mt-4 text-sm sm:text-base font-semibold">
          Hari Spesial: <strong>{getDateText(targetDate)} 🎉</strong>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
      {children}
    </>
  );
}
