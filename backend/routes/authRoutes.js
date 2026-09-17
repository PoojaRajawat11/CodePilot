import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  console.log("🔥 AUTH TEST ROUTE HIT");

  res.json({
    success: true,
    message: "Auth routes working"
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

/* =========================
   PROTECTED USER ROUTE
========================= */
router.get("/me", protect, getProfile);

/* =========================
   ROLE-BASED ROUTES
========================= */

// 👤 USER + ADMIN ACCESS
router.get(
  "/dashboard",
  protect,
  authorizeRoles("user", "admin"),
  (req, res) => {
    res.json({
      message: "Dashboard access granted",
      user: req.user,
    });
  }
);

// 🔥 ADMIN ONLY ROUTE
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
  
);

export default router;