import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  generateSolution,
  analyzeFailure,
  generateHint,
  mockInterview,
  getWeakTopics,
  getLearningPath,
  getPersonalCoach,
  getRecommendations,
  saveSubmission,
  getSubmissions,
  getDailyProblems,
  getProgressChart,
  getProfileStats,
  getLeaderboard,
  getDailyChallenge,
  conversationalInterview,
} from "../controllers/AIController.js";

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI routes are working",
  });
});

// AI ROUTES
router.post("/solution", generateSolution);
router.post("/analyze", analyzeFailure);
router.post("/mock-interview", mockInterview);

router.post(
  "/conversational-interview",
  protect,
  conversationalInterview
);

// SUBMISSIONS
router.post("/save-submission", protect, saveSubmission);
router.get("/submissions", protect, getSubmissions);

// PROTECTED AI
router.post("/hint", protect, generateHint);
router.get("/weak-topics", protect, getWeakTopics);
router.get("/learning-path", protect, getLearningPath);
router.get("/coach", protect, getPersonalCoach);
router.get("/daily-problems", protect, getDailyProblems);
router.get("/progress-chart", protect, getProgressChart);
router.get("/recommendations", protect, getRecommendations);
router.get("/profile-stats", protect, getProfileStats);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/daily-challenge", getDailyChallenge);

export default router;