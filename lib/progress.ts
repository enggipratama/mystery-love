export const canAccess = (level: number) => {
  if (typeof window === "undefined") return false;
  const progress = localStorage.getItem("progress");
  return progress && Number(progress) >= level - 1;
};
