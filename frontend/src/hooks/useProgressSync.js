import { useEffect, useState } from "react";
import { getProgress } from "../utils/progress";

export const useProgressSync = () => {
  const [progress, setProgress] = useState(getProgress());

  // 🔁 REAL-TIME SYNC (same tab + cross tab)
  useEffect(() => {
    const handleUpdate = () => {
      setProgress(getProgress());
    };

    // 🔥 same app updates
    window.addEventListener("progress-update", handleUpdate);

    // 🔥 other tabs updates
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("progress-update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // 🔁 manual refresh (optional use)
  const refresh = () => {
    setProgress(getProgress());
  };

  return { progress, refresh };
};