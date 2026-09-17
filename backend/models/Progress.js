import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    solvedProblems: {
      type: [String],
      default: [],
    },

    attempts: {
      type: Number,
      default: 0,
    },

    passed: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 1200,
    },

    topicStats: {
      type: Object,
      default: {},
    },

    activities: {
      type: Array,
      default: [],
    },

    // 🔥 NEW: STREAK SYSTEM (SAFE ADDITION)
    currentStreak: {
      type: Number,
      default: 0,
    },

    lastActiveDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// model
const Progress = mongoose.model("Progress", progressSchema);

export default Progress;