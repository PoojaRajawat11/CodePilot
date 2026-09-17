import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    language: {
      type: String,
      default: "javascript",
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong",
        "TLE",
        "Runtime Error",
        "Compile Error",
      ],
      default: "Wrong",
    },

    topic: {
      type: String,
      default: "Unknown",
    },

    xp: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: String,
      default: "",
    },

    memory: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },

    aiFeedback: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    mistakes: {
      type: [String],
      default: [],
    },
    aiReview: {
  type: String,
  default: "",
},

timeComplexity: {
  type: String,
  default: "",
},

spaceComplexity: {
  type: String,
  default: "",
},

codeQuality: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model(
  "Submission",
  submissionSchema
);

export default Submission;