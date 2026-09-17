import mongoose from "mongoose";

// Example Schema
const exampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String,
  },
  { _id: false }
);

// Test Case Schema
const testCaseSchema = new mongoose.Schema(
  {
    input: mongoose.Schema.Types.Mixed,
    expected: String,
  },
  { _id: false }
);

// New Approach Schema
const approachSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    algorithm: {
      type: String,
      default: "",
    },

    code: {
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

    timeComplexity: {
      type: String,
      default: "",
    },

    spaceComplexity: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    companies: {
      type: [String],
      default: [],
    },

    // Problem Content
    description: {
      type: String,
      required: true,
    },

    // Existing fields (keep these)
    bruteForce: {
      type: String,
      default: "",
    },

    optimal: {
      type: String,
      default: "",
    },

    complexity: {
      brute: {
        type: String,
        default: "",
      },

      optimal: {
        type: String,
        default: "",
      },
    },

    // New Multiple Approaches Feature
    approaches: {
      type: [approachSchema],
      default: [],
    },

    pattern: {
      type: String,
      default: "",
    },

    interviewTips: {
      type: [String],
      default: [],
    },

    mistakes: {
      type: [String],
      default: [],
    },

    // Starter Code
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

    // Judge0 Visible Tests
    visibleTests: {
      type: [testCaseSchema],
      default: [],
    },

    // Judge0 Hidden Tests
    hiddenTests: {
      type: [testCaseSchema],
      default: [],
    },

    // Additional Information
    statement: {
      type: String,
      default: "",
    },

    constraints: {
      type: [String],
      default: [],
    },

    examples: {
      type: [exampleSchema],
      default: [],
    },

    topics: {
      type: [String],
      default: [],
    },

    acceptanceRate: {
      type: Number,
      default: 0,
    },

    totalSubmissions: {
      type: Number,
      default: 0,
    },

    successfulSubmissions: {
      type: Number,
      default: 0,
    },

    premium: {
      type: Boolean,
      default: false,
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

const Problem = mongoose.model(
  "Problem",
  problemSchema
);

export default Problem;