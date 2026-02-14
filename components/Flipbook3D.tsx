"use client";

import { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import Lottie from "lottie-react";
import Image from "next/image";
import gift from "@/public/cat/gift.json";
import cake from "@/public/cat/cake.json";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import TextType from "@/components/TextType";
import { useMounted } from "@/hooks/useMounted";
import { useConfetti } from "@/hooks/useConfetti";
import { COLORS } from "@/constants/game";

interface Props {
  pages: string[];
}

interface PageProps {
  src: string;
  index: number;
}

function FlipbookPage({ src, index }: PageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full bg-pink-200 text-pink-600 p-4">
        <p className="text-center font-bold">Gambar tidak dapat dimuat</p>
        <p className="text-sm text-center">Halaman {index + 1}</p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Page ${index + 1}`}
      fill
      className="object-contain"
      onError={() => setHasError(true)}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  );
}

export default function FlipbookModal({ pages }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const flipBookRef = useRef<HTMLFlipBook>(null);
  const mounted = useMounted(0);
  const { windowSize, confettiConfig } = useConfetti();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Buka hadiah"
        className="focus:outline-none rounded-full"
      >
        <div className="w-64 h-64 sm:w-96 sm:h-96">
          <Lottie animationData={gift} loop autoplay />
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#fbcce1] bg-opacity-80 p-6" style={{ overscrollBehavior: 'none', touchAction: 'pan-y' }}>
          {mounted && (
            <Confetti
              numberOfPieces={confettiConfig.numberOfPieces}
              recycle={confettiConfig.recycle}
              width={windowSize.width}
              height={windowSize.height}
            />
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-5 right-5 text-pink-500 text-3xl font-bold z-50 hover:text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
            aria-label="Tutup"
          >
            &times;
          </button>

          <div className="flex flex-col items-center max-w-3xl mx-auto w-full overflow-x-hidden">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 sm:w-48 sm:h-48">
                <Lottie animationData={cake} loop autoplay />
              </div>
              <ShinyText
                text="Happy Birthday Sayang 💖"
                speed={2}
                delay={0}
                color={COLORS.PRIMARY}
                shineColor={COLORS.SHINE}
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

            <div className="w-full max-w-[500px] mx-auto overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                className="mb-6"
                style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}
              >
                {pages.map((img, index) => (
                  <div
                    key={index}
                    className="relative flex justify-center items-center bg-pink-300 shadow-md rounded-lg overflow-hidden"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <FlipbookPage src={img} index={index} />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            <div className="bg-white p-6 rounded-2xl text-gray-700 shadow-lg border-t-5 border-pink-400 w-full relative mb-10 overflow-visible">
              <div className="absolute -top-3 right-2 w-10 h-10 rotate-12 z-10">
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
