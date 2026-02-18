"use client";

import { useEffect, useRef } from "react";

interface KeyHandler {
  key: string | string[];
  handler: () => void;
  preventDefault?: boolean;
}

interface UseKeyPressOptions {
  enabled?: boolean;
}

export function useKeyPress(
  handlers: KeyHandler[],
  options: UseKeyPressOptions = {}
) {
  const { enabled = true } = options;
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      handlersRef.current.forEach(({ key, handler, preventDefault }) => {
        const keys = Array.isArray(key) ? key : [key];
        
        if (keys.includes(e.key)) {
          if (preventDefault) {
            e.preventDefault();
          }
          handler();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}

export function useNumericKeyPress(
  handler: (num: number) => void,
  options?: UseKeyPressOptions
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useKeyPress(
    [
      { key: "1", handler: () => handlerRef.current(1) },
      { key: "2", handler: () => handlerRef.current(2) },
      { key: "3", handler: () => handlerRef.current(3) },
      { key: "4", handler: () => handlerRef.current(4) },
      { key: "5", handler: () => handlerRef.current(5) },
      { key: "6", handler: () => handlerRef.current(6) },
      { key: "7", handler: () => handlerRef.current(7) },
      { key: "8", handler: () => handlerRef.current(8) },
      { key: "9", handler: () => handlerRef.current(9) },
      { key: "0", handler: () => handlerRef.current(0) },
    ],
    options
  );
}
