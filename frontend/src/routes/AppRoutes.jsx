import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Problems from "../pages/Problems/Problems";
import ProblemDetails from "../pages/ProblemDetails/ProblemDetails";
import Dashboard from "../pages/Dashboard/Dashboard";
import Playground from "../pages/Playground";
import Roadmaps from "../pages/Roadmaps/Roadmaps";
import CompanySheet from "../pages/CompanySheet";

import SubmissionHistory from "../pages/SubmissionHistory.jsx";
import WeakTopics from "../pages/WeakTopics.jsx";
import Profile from "../pages/Profile.jsx";
import LearningPath from "../pages/LearningPath.jsx";
import Coach from "../pages/Coach.jsx";
import DailyProblems from "../pages/DailyProblems.jsx";
import Progress from "../pages/Progress.jsx";
import Leaderboard from "../pages/Leaderboard.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/problems" element={<Problems />} />
      <Route path="/problem/:id" element={<ProblemDetails />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/roadmaps" element={<Roadmaps />} />

      <Route path="/company/:company" element={<CompanySheet />} />

      <Route path="/submissions" element={<SubmissionHistory />} />
      <Route path="/weak-topics" element={<WeakTopics />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/learning-path" element={<LearningPath />} />
      <Route path="/coach" element={<Coach />} />
      <Route path="/daily-problems" element={<DailyProblems />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}

export default AppRoutes;