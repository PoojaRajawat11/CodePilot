import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Problems from "./pages/Problems/Problems";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Playground from "./pages/Playground";
import Roadmaps from "./pages/Roadmaps/Roadmaps";
import RoadmapDetails from "./pages/Roadmaps/RoadmapDetails";
import Profile from "./pages/Profile.jsx";
import Progress from "./pages/Progress";
import Leaderboard from "./pages/Leaderboard.jsx";
import Mentor from "./pages/Mentor";
import Interview from "./pages/Interview";
import InterviewPreparation from "./pages/InterviewPreparation";
import InterviewSetup from "./pages/InterviewPreparation/InterviewSetup";
import InterviewSession from "./pages/InterviewPreparation/InterviewSession";

function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Problems */}
      <Route path="/problems" element={<Problems />} />

      <Route
        path="/problem/:id"
        element={<ProblemDetails />}
      />

      {/* Playground */}
      <Route
        path="/playground"
        element={<Playground />}
      />

      <Route
        path="/playground/:id"
        element={<Playground />}
      />

      {/* Roadmaps */}
      <Route
        path="/roadmaps"
        element={<Roadmaps />}
      />

      <Route
        path="/roadmap/:id"
        element={<RoadmapDetails />}
      />

      {/* Profile / Progress */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/progress"
        element={<Progress />}
      />

      <Route
        path="/leaderboard"
        element={<Leaderboard />}
      />

      {/* AI Mentor */}
      <Route
        path="/mentor"
        element={<Mentor />}
      />

      {/* Interview */}
      <Route
        path="/interview/:id"
        element={<Interview />}
      />

      <Route
        path="/interview-preparation"
        element={<InterviewPreparation />}
      />

      <Route
        path="/interview-preparation/setup/:type"
        element={<InterviewSetup />}
      />

      <Route
        path="/interview-preparation/session/:type"
        element={<InterviewSession />}
      />

    </Routes>
  );
}

export default App;