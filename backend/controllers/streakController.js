import Streak from "../models/Streak.js";

// ======================
// GET USER STREAK
// ======================
export const getStreak = async (
  req,
  res
) => {
  try {
    const streak = await Streak.findOne({
      userId: req.user._id,
    });

    if (!streak) {
      return res.json({
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    res.json(streak);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};