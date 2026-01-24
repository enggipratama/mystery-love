
export const setLevelCompleted = (level: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("completedLevel", level.toString());
  }
};

export const getCompletedLevel = (): number => {
  if (typeof window !== "undefined") {
    const lvl = localStorage.getItem("completedLevel");
    return lvl ? parseInt(lvl) : 0;
  }
  return 0;
};
