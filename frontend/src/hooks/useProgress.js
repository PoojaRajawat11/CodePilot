import { useEffect, useState } from "react";
import { getProgress, saveProgress } from "../utils/progress";

export const useProgress = () => {
  const [progress, setProgress] = useState(getProgress());

  // ✅ Load once on mount
  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // ✅ Sync helper (safe update function)
  const updateProgress = (updater) => {
    setProgress((prev) => {
      const updated =
        typeof updater === "function"
          ? updater(prev)
          : { ...prev, ...updater };

      saveProgress(updated);
      return updated;
    });
  };

  // ✅ Force refresh from storage (optional)
  const refreshProgress = () => {
    const data = getProgress();
    setProgress(data);
  };

  return {
    progress,
    setProgress,
    updateProgress,
    refreshProgress,
  };
};