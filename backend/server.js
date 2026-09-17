import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import compilerRoutes from "./routes/compilerRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// DB connection
import connectDB from "./config/db.js";
connectDB();

// Routes
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import aiRoadmapRoutes from "./routes/aiRoadmapRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";

import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/ai-roadmap", aiRoadmapRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/user", userRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/resume", resumeRoutes);
// test route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});