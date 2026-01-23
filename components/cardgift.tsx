import TextType from "@/components/TextType";
import Lottie from "lottie-react";
import cat from "@/public/cat/cat.json";

export default function CardGift() {
  return (
    <div className="bg-white p-6 rounded-2xl text-gray-700 shadow-lg border-t-5 border-pink-400 w-full max-w-2xl mt-6 relative">
      <div className="absolute -top-4 -right-4 w-12 h-12 rotate-12">
        <Lottie animationData={cat} loop autoplay />
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
  );
}
