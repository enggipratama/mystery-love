"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCompletedLevel } from "../utils/progress";

interface ProtectedLevelProps {
  level: number;
  children: React.ReactNode;
}

export default function ProtectedLevel({
  level,
  children,
}: ProtectedLevelProps) {
  const router = useRouter();

  useEffect(() => {
    const completedLevel = getCompletedLevel();
    if (completedLevel < level - 1) {
      router.replace(`/level-${completedLevel + 1}`);
    }
  }, [level, router]);

  return <>{children}</>;
}
