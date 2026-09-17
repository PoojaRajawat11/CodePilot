import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    lastSolvedDate: {
      type: Date,
      default: null,
    },

    // ⭐ XP SYSTEM
    xp: {
      type: Number,
      default: 0,
    },

    // ⭐ LEVEL SYSTEM
    level: {
      type: Number,
      default: 1,
    },

    // ⭐ REWARDS / BADGES
    badges: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Streak = mongoose.model(
  "Streak",
  streakSchema
);

export default Streak;