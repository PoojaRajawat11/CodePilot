import mongoose from "mongoose";

const companyQuestionSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    frequency: {
      type: Number,
      default: 0,
    },

    acceptanceRate: {
      type: Number,
      default: 0,
    },

    topics: {
      type: [String],
      default: [],
    },

    // Kept only as source/reference data.
    // We will NOT show/use it as the learner's solving destination.
    sourceLink: {
      type: String,
      default: "",
    },
timePeriod: {
  type: String,
  default: "All",
},
    // Later this will contain your CodePilot practice data.
    description: {
      type: String,
      default: "",
    },

    constraints: {
      type: [String],
      default: [],
    },

    examples: {
      type: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],
      default: [],
    },

    starterCode: {
      javascript: {
        type: String,
        default: "",
      },
      python: {
        type: String,
        default: "",
      },
      java: {
        type: String,
        default: "",
      },
      cpp: {
        type: String,
        default: "",
      },
    },

    visibleTests: {
      type: [
        {
          input: String,
          output: String,
        },
      ],
      default: [],
    },

    hiddenTests: {
      type: [
        {
          input: String,
          output: String,
        },
      ],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CompanyQuestion",
  companyQuestionSchema
);
