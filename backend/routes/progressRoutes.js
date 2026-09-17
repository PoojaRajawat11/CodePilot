import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProgress,
  updateProgress,
} from "../controllers/progressController.js";

const router = express.Router();

// 📊 GET progress dashboard data
router.get("/", protect, getProgress);

// 🔥 UPDATE progress (solve problem, activity, streak update)
router.post("/update", protect, updateProgress);

export default router;