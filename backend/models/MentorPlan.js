import mongoose from "mongoose";

const mentorPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    weakTopics: {
      type: [String],
      default: [],
    },

    tasks: [
      {
        title: String,
        topic: String,
        difficulty: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  "MentorPlan",
  mentorPlanSchema
);