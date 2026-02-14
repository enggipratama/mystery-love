"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/sad.json";
import ShinyText from "@/components/ShinyText";

const Please: React.FC = () => {
  const router = useRouter();
  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
       <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
        <Lottie animationData={cat} loop autoplay />
      </div>
      <ShinyText
        text=":( Oh noooo!"
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
      <p className="text-center max-w-md text-gray-600 px-4">
        I promise you&apos;ll like it!
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-bold bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 hover:scale-110 transition duration-300"
        >
          Please :(
        </button>
      </div>
    </main>
  );
};
export default Please;
