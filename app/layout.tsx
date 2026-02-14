import type { Metadata } from "next";
import { Comic_Relief } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import CountdownGuard from "@/components/CountdownGuard";
import { TARGET_DATE } from "@/lib/countdown";
import MusicPlayer from "@/components/MusicPlayer";
import { LoadingProvider } from "@/contexts/LoadingContext";

const comicRelief = Comic_Relief({
  variable: "--font-comic-relief",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export const metadata: Metadata = {
  title: "Surprise for You 💌",
  description: "A special surprise just for you!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${comicRelief.className} antialiased`}>
        <LoadingProvider>
          <ClientLayout>
            <CountdownGuard targetDate={TARGET_DATE}>
              <MusicPlayer />
              {children}
            </CountdownGuard>
          </ClientLayout>
        </LoadingProvider>
      </body>
    </html>
  );
}
