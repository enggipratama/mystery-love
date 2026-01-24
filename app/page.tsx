"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
      {mounted && <Confetti numberOfPieces={500} recycle={false} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-30 h-30 sm:w-40 sm:h-40">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text="💖 The Memory Vault"
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
          Ready to embark on a journey filled with love, surprises, and
          delightful moments?
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/level-1")}
            className="px-4 py-2 text-sm font-bold bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 hover:scale-110 transition duration-300"
          >
            I&apos;m Ready
          </button>

          <button
            onClick={() => router.push("/please")}
            className="px-4 py-2 text-sm font-bold bg-pink-300 text-pink-700 rounded-full shadow-lg hover:bg-pink-400 hover:scale-110 transition duration-300"
          >
            No Thanks
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default HomePage;
