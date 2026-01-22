"use client";
import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import cat from "@/public/cat/cat1.json";
import catlove from "@/public/cat/cat.json";
import level from "@/public/cat/level-1.json";
import cat2 from "@/public/cat/cat2.json";
import sad from "@/public/cat/sad.json";
import cake from "@/public/cat/cake.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import TextType from "@/components/TextType";

const CORRECT_PIN = "0406";

const ScratchCard = ({ imageSrc }: { imageSrc: string }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const isInitialized = React.useRef(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [randomAnim] = React.useState(() => {
    const animations = [cat, cat2, level, catlove, sad];
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      if (isInitialized.current) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        ctx.fillStyle = "#dfdcde";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "10px monospace";
        ctx.fillStyle = "#1d1c1c";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Scratch Me!", canvas.width / 2, canvas.height / 2);
        isInitialized.current = true;
      }
    };

    const timeoutId = setTimeout(initCanvas, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const checkCompletion = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > 85) {
      setIsFinished(true);
    }
  };

  const scratch = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || isFinished) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkCompletion(ctx, canvas.width, canvas.height);
  };

  return (
    <div className="relative w-full h-full aspect-square overflow-hidden group rounded-xl">
      <motion.img
        src={imageSrc}
        alt="Kita"
        animate={
          isFinished
            ? {
                scale: [1, 1.2, 1.05],
                rotate: [0, 5, -5, 0],
                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
              }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full object-cover block"
      />

      <motion.canvas
        ref={canvasRef}
        animate={
          isFinished ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }
        }
        onMouseMove={(e) => e.buttons === 1 && scratch(e)}
        onTouchMove={(e) => {
          if (e.cancelable) e.preventDefault();
          scratch(e);
        }}
        className="absolute inset-0 cursor-crosshair touch-none"
      />

      {/* Efek Bintang/Love kecil saat selesai */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-end justify-start pointer-events-none"
        >
          <span className="w-10 h-10">
            <Lottie animationData={randomAnim} loop autoplay />
          </span>
        </motion.div>
      )}
    </div>
  );
};

const LevelFive: React.FC = () => {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setIsUnlocked(true);
          setError(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 600);
        }
      }
    }
  };

  const clearPin = () => setPin("");

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1]  p-4 overflow-hidden relative">
      {isUnlocked && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="safebox"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ y: -500, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-2">
              <Lottie animationData={cat} loop autoplay />
            </div>

            <ShinyText
              text="Safe Box Memory 💖"
              speed={2}
              delay={0}
              color="#e60076"
              shineColor="#ffd0e1"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
            />

            <div
              className={`bg-white p-6 rounded-[2rem] border-4 ${error ? "border-pink-500 animate-shake" : "border-pink-300"} shadow-xl`}
            >
              <div className="bg-pink-50 p-4 rounded-xl mb-6 border-2 border-pink-200 flex justify-center gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i ? "bg-pink-500 scale-110" : "bg-pink-200"}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num.toString())}
                    className="w-16 h-16 bg-white hover:bg-pink-100 active:scale-95 text-pink-600 text-xl font-bold rounded-2xl transition-all border-2 border-pink-200 shadow-sm"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={clearPin}
                  className="w-16 h-16 text-pink-500 font-bold text-sm"
                >
                  Hapus
                </button>
                <button
                  onClick={() => handleKeyPress("0")}
                  className="w-16 h-16 bg-white text-pink-600 text-xl font-bold rounded-2xl border-2 border-pink-200 shadow-sm"
                >
                  0
                </button>
                <div className="w-16 h-16 flex items-center justify-center text-pink-300 font-bold text-xs uppercase">
                  Pin
                </div>
              </div>
            </div>
            <p className="mt-6 text-pink-400 text-xs font-medium text-center">
              Clue : Berhubungan dengan aku wleee!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-2">
              <Lottie animationData={cake} loop autoplay />
            </div>
            <ShinyText
              text="Happy Birthday ❤️"
              speed={2}
              color="#e60076"
              className="text-2xl font-bold mb-6 text-center"
            />

            <div className="columns-2 gap-2 w-full space-y-2 mb-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="rounded-sm overflow-hidden border-6 border-pink-400 shadow-md bg-pink-400 min-h-[100px]"
                >
                  <ScratchCard imageSrc={`/images/we-${i}.jpeg`} />
                </motion.div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl text-gray-700 shadow-lg border-t-5 border-pink-400 w-full relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 rotate-12">
                <Lottie animationData={catlove} loop autoplay />
              </div>
              <h3 className="text-lg font-bold text-pink-600 mb-2">
                Happy Birthday Sayang! 🎂 🎉
              </h3>
              <div className="text-sm leading-relaxed italic">
                <TextType
                  text={[
                    "Selamat, Sayang! Akhirnya sampai di level terakhir dan berhasil membuka brankas ini, pinter juga yaaa 😜. Aku sengaja bikin website ini biar kamu mengingat sedikit momen kita hehe. Di hari ulang tahunmu ini, aku mau ngucapin terima kasih karena kamu sudah menjadi salah satu alasan aku untuk terus belajar dan berkembang, termasuk belajar membuat website ini hanya untuk melihat senyummu, anjayyyy 🤙. Kamu adalah sistem pendukung terbaik, pendengar yang sabar, dan pemilik senyum yang selalu bisa menenangkan duniaku, anjayyy part 2 ✌️. Semoga dengan bertambahnya usia ini, kamu selalu dikelilingi oleh orang-orang yang tulus menyayangimu, diberikan kesehatan yang luar biasa, dan setiap impian yang kamu bisikkan dalam doa segera menjadi nyata. Jangan pernah ragu dengan kemampuanmu, karena bagiku, kamu adalah orang yang hebat. Aku akan selalu ada di sini, di setiap level kehidupanmu selanjutnya, untuk mendukungmu dan mencintaimu lebih dari hari ini. Selamat ulang tahun, Cantik. I love you more than words, code, and everything in between.",
                  ]}
                  typingSpeed={75}
                  pauseDuration={120000}
                  showCursor
                  cursorCharacter="_"
                />
              </div>
              <p className="mt-4 font-bold text-start text-pink-500">
                - Your Favorite Boy -
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
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
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  );
};

export default LevelFive;
