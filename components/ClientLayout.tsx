"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Loader from "./Loader";
import { useLoading } from "@/contexts/LoadingContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setIsLoading } = useLoading();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];

    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    timersRef.current.push(timer);

    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, [pathname, setIsLoading]);

  return (
    <>
      <LoaderWrapper />
      {children}
    </>
  );
}

function LoaderWrapper() {
  const { isLoading } = useLoading();
  return isLoading ? <Loader /> : null;
}
