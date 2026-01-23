"use client";

import { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import Lottie from "lottie-react";
import gift from "@/public/cat/gift.json";
import cake from "@/public/cat/cake.json";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import TextType from "@/components/TextType";

interface Props {
  pages: string[];
}

export default function FlipbookModal({ pages }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const flipBookRef = useRef<HTMLFlipBook>(null);
  const [mounted, setMounted] = useState(false);

  // 🔹 pastikan Confetti hanya muncul di client tanpa triggering warning
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  return (
    <>
      {/* Tombol untuk membuka modal */}
      <button onClick={() => setIsOpen(true)} className="">
        <div className="w-64 h-64 sm:w-96 sm:h-96">
          <Lottie animationData={gift} loop autoplay />
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fbcce1] bg-opacity-80 p-6">
          {/* Tombol close */}
          {mounted && <Confetti numberOfPieces={500} recycle={false} />}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-5 right-5 text-pink-500 text-3xl font-bold z-50"
          >
            &times;
          </button>

          <div className="flex flex-col items-center max-w-3xl mx-auto">
            {/* GIF dan Text di atas Flipbook */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 sm:w-48 sm:h-48">
                <Lottie animationData={cake} loop autoplay />
              </div>
              <ShinyText
                text={"Happy Birthday Sayang 💖"}
                speed={2}
                delay={0}
                color="#e60076"
                shineColor="#ffd0e1"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
                className="text-center text-2xl sm:text-4xl font-bold"
              />
            </div>

            <p className="text-gray-700 text-sm sm:text-lg font-medium opacity-80 mb-6 text-center">
              &quot;Slide ya sayangg...&quot;
            </p>

            {/* Flipbook */}
            <HTMLFlipBook
              ref={flipBookRef}
              width={500}
              height={750}
              size="stretch"
              showCover={false}
              drawShadow={true}
              flippingTime={600}
              usePortrait={true}
              autoSize={true}
              mobileScrollSupport={true}
              className="mb-6 w-full max-w-[500px] mx-auto"
            >
              {pages.map((img, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center bg-pink-300 shadow-md rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </HTMLFlipBook>

            {/* Card Text */}
            <div className="bg-white p-6 rounded-2xl text-gray-700 shadow-lg border-t-5 border-pink-400 w-full relative mb-10">
              <div className="absolute -top-4 -right-4 w-12 h-12 rotate-12">
                <Lottie animationData={cat} loop autoplay />
              </div>
              <h3 className="text-lg font-bold text-pink-600 mb-2">
                Selamat Menua! 🎂 🎉
              </h3>
              <div className="text-sm leading-relaxed italic">
                <TextType
                  text={[
                    "Akhirnya sampai di level terakhir dan berhasil sampai sini, pinter juga yaaa 😜. Aku sengaja bikin website ini biar kamu mengingat sedikit momen kita hehe. Di hari ulang tahunmu ini, aku mau ngucapin terima kasih karena kamu sudah menjadi salah satu alasan aku untuk terus belajar dan berkembang, termasuk belajar membuat website ini hanya untuk melihat senyummu, anjayyyy 🤙. Kamu adalah sistem pendukung terbaik, pendengar yang sabar, dan pemilik senyum yang selalu bisa menenangkan duniaku, anjayyy part 2 ✌️. Semoga dengan bertambahnya usia ini, kamu selalu dikelilingi oleh orang-orang yang tulus menyayangimu, diberikan kesehatan yang luar biasa, dan setiap impian yang kamu bisikkan dalam doa segera menjadi nyata. Jangan pernah ragu dengan kemampuanmu, karena bagiku, kamu adalah orang yang hebat. Aku akan selalu ada di sini, di setiap level kehidupanmu selanjutnya, untuk mendukungmu dan mencintaimu lebih dari hari ini. Selamat ulang tahun, Cantik. I love you more than words, code, and everything in between.",
                  ]}
                  typingSpeed={75}
                  pauseDuration={120000}
                  showCursor
                  cursorCharacter="_"
                />
              </div>
              <p className="mt-4 font-bold text-pink-500">
                - Your Favorite Boy -
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
