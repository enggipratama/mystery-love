"use client";
import React, { useState, useEffect } from "react";
import FlipbookModal from "@/components/Flipbook3D";
import Lottie from "lottie-react";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { getCompletedLevel } from "@/utils/progress";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const completedLevel = getCompletedLevel();
    if (completedLevel < 7) {
      router.replace(`/level-${completedLevel + 1}`);
    }
  }, [router]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const pages = [
    "/flipbook/1.png",
    "/flipbook/2.png",
    "/flipbook/3.png",
    "/flipbook/4.png",
    "/flipbook/5.png",
    "/flipbook/6.png",
    "/flipbook/7.png",
    "/flipbook/8.png",
    "/flipbook/9.png",
    "/flipbook/10.png",
    "/flipbook/11.png",
    "/flipbook/12.png",
  ];

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
      {mounted && <Confetti numberOfPieces={500} recycle={false} />}
      <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
        <Lottie animationData={cat} loop autoplay />
      </div>
      <ShinyText
        text="Wiihh tebakan kamu benar, sekarang ambil hadiahnya yaa"
        speed={2}
        delay={0}
        color="#e60076"
        shineColor="#ffd0e1"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
        className="text-center text-2xl sm:text-4xl font-bold mb-4 mx-10"
      />
      <p className="text-gray-700 text-sm sm:text-lg font-medium opacity-80 mb-2">
        &quot;Klik Giftnya ya sayang&quot;
      </p>
      <div className="text-center max-w-md text-gray-600 px-4">
        <FlipbookModal pages={pages} />
      </div>
    </main>
  );
}
