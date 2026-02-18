"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Lottie from "lottie-react";
import cat from "@/public/cat/sad.json";
import ShinyText from "./ShinyText";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#fbcce1] relative overflow-hidden px-4">
          <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
            <Lottie animationData={cat} loop autoplay />
          </div>

          <ShinyText
            text="Oops! Ada yang salah 😢"
            speed={2}
            delay={0}
            color="#e60076"
            shineColor="#ffd0e1"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-center text-2xl sm:text-3xl font-bold mb-2"
          />

          <p className="text-center max-w-md text-gray-600 px-4 text-sm mb-6">
            Maaf ya, ada error yang terjadi. Coba refresh halaman atau kembali ke beranda.
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="bg-white/50 p-4 rounded-lg mb-4 max-w-md overflow-auto">
              <p className="text-xs text-red-500 font-mono">
                {this.state.error.message}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleReload}
              className="px-4 py-2 text-sm font-bold bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 hover:scale-110 transition duration-300"
            >
              Refresh Halaman
            </button>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 text-sm font-bold bg-pink-300 text-pink-700 rounded-full shadow-lg hover:bg-pink-400 hover:scale-110 transition duration-300"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
