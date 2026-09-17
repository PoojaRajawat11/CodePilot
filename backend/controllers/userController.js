import Submission from "../models/Submission.js";
import Streak from "../models/Streak.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 ALL SUBMISSIONS
    const submissions = await Submission.find({ userId });

    const total = submissions.length;
    const accepted = submissions.filter(
      (s) => s.status === "Accepted"
    ).length;

    const accuracy = total
      ? Math.round((accepted / total) * 100)
      : 0;

    // 🔥 STREAK
    const streak = await Streak.findOne({ userId });

    // 🔥 WEAKEST TOPIC
    const topicMap = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, wrong: 0 };
      }

      topicMap[topic].total++;

      if (s.status !== "Accepted") {
        topicMap[topic].wrong++;
      }
    });

    const weakTopics = Object.entries(topicMap).map(
      ([topic, data]) => ({
        topic,
        accuracy: Math.round(
          ((data.total - data.wrong) / data.total) * 100
        ),
      })
    );

    // 🔥 RECENT SUBMISSIONS
    const recent = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
  success: true,
  data: {
    totalProblems: total,
    accepted,
    accuracy,

    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,

    xp: streak?.xp || 0,
    level: streak?.level || 1,
    badges: streak?.badges || [],

    weakTopics,
    recent,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile fetch failed",
    });
  }
};