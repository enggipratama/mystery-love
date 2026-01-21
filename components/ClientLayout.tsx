"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);

      const hideTimer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(hideTimer);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}
