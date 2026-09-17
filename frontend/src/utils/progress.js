const DEFAULT_PROGRESS = {
  solvedProblems: [],
  attempts: 0,
  passed: 0,
  streak: 0,
  companyStats: {},
  topicStats: {},
  activities: [],
};

// ✅ SAFE GET PROGRESS
export const getProgress = () => {
  try {
    const data = localStorage.getItem("progress");

    if (!data) return DEFAULT_PROGRESS;

    const parsed = JSON.parse(data);

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (error) {
    console.log("Progress load error:", error);
    return DEFAULT_PROGRESS;
  }
};

// ✅ SAFE SAVE PROGRESS (REAL-TIME SYNC)
export const saveProgress = (data) => {
  try {
    localStorage.setItem("progress", JSON.stringify(data));

    // 🔥 trigger real-time update inside same app
    window.dispatchEvent(new Event("progress-update"));
  } catch (error) {
    console.log("Progress save error:", error);
  }
};