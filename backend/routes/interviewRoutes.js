import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getInterviewReadiness,
  startInterview,
  answerQuestion,
  getInterviewSession,
} from "../controllers/interviewController.js";

const router = express.Router();

// Existing route
router.get("/readiness", protect, getInterviewReadiness);

// New routes
router.post("/start", protect, startInterview);

router.post("/answer", protect, answerQuestion);

router.get("/session/:id", protect, getInterviewSession);

export default router;