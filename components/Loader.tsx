"use client";
import Lottie from "lottie-react";
import loadingAnimation from "../public/cat/loading.json";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-200">
      <Lottie className="w-30 h-30" animationData={loadingAnimation} loop autoplay />
    </div>
  );
}
