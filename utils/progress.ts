export const setLevelCompleted = (level: number) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("completedLevel", level.toString());
    } catch (e) {
      console.warn("Failed to save progress:", e);
    }
  }
};

export const getCompletedLevel = (): number => {
  if (typeof window !== "undefined") {
    try {
      const lvl = localStorage.getItem("completedLevel");
      return lvl ? parseInt(lvl, 10) : 0;
    } catch (e) {
      console.warn("Failed to get progress:", e);
      return 0;
    }
  }
  return 0;
};
