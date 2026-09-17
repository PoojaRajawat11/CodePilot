import Progress from "../models/Progress.js";

export const getDashboard = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      return res.json({
        totalSolved: 0,
        attempts: 0,
        passed: 0,
        successRate: 0,
        currentStreak: 0,
        rating: 1200,
        recentActivities: [],
      });
    }

    const successRate =
      progress.attempts > 0
        ? Number(
            (
              (progress.passed / progress.attempts) *
              100
            ).toFixed(2)
          )
        : 0;

    res.json({
      totalSolved: progress.solvedProblems.length,
      attempts: progress.attempts,
      passed: progress.passed,
      successRate,
      currentStreak: progress.currentStreak,
      rating: progress.rating,
      topicStats: progress.topicStats,
      recentActivities: progress.activities
        .slice(-10)
        .reverse(),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};