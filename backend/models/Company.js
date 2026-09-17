import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    requiredTopics: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);