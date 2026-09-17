import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCompanyReadiness } from "../controllers/companyController.js";

const router = express.Router();

router.get("/:companyName", protect, getCompanyReadiness);

export default router;