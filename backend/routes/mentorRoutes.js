import express from "express";

import {
  generateTodayPlan,
  getTodayPlan,
  markTaskComplete,
  chatWithMentor,
  chatWithStudyMentor,
} from "../controllers/mentorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today", protect, getTodayPlan);

router.post("/generate", protect, generateTodayPlan);

router.post("/complete", protect, markTaskComplete);

router.post("/chat", protect, chatWithMentor);

router.post("/study-chat", protect, chatWithStudyMentor);

export default router;