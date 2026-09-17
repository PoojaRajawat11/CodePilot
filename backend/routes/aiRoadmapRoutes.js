import express from "express";
import { getAIRoadmap } from "../controllers/aiRoadmapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, getAIRoadmap);

export default router;