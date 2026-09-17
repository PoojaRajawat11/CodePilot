import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProblemCard from "../../components/ProblemCard/ProblemCard";
function Problems() {
  // STATE
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);
  // FETCH FROM BACKEND
  useEffect(() => {
  const fetchProblems = async () => {
    try {
      setLoading(true);
      // Problems
      const res = await axios.get(
        "http://localhost:5000/api/problems"
      );
      setProblems(res.data);
const token = localStorage.getItem("token");

console.log("FRONTEND TOKEN:", token);

if (token) {
  try {
    const subRes = await axios.get(
      "http://localhost:5000/api/ai/submissions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSubmissions(subRes.data);

  } catch (err) {
    console.log("Couldn't fetch submissions");
    setSubmissions([]);
  }
} else {
  setSubmissions([]);
}

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  fetchProblems();
}, []);

  // FILTER LOGIC
  const filteredProblems = problems.filter((p) => {
    const matchSearch = p.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchDifficulty =
      difficulty === "All" ||
      p.difficulty === difficulty;

    return matchSearch && matchDifficulty;
  });
  const submissionMap = {};

submissions.forEach((s) => {
  submissionMap[s.problemId] = s.status;
});

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Problems...
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white ">
     {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          CodePilot AI
        </h1>

        <div className="flex gap-6 text-lg">

          <Link to="/">
            Home
          </Link>
          <Link to="/dashboard">
            Dashboard
          </Link>
          <Link to="/playground">Playground</Link>
          <Link to="/problems">
            Problems
          </Link>
          <Link to="/profile">
            Profile
          </Link>
          <Link to="/leaderboard">
            Leaderboard
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

        </div>
      </nav>
      {/* HEADER */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-10 mt-10">
        DSA Problems
      </h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-8">

        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white w-1/2"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded bg-slate-800 text-white"
        >
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

      </div>

      {/* PROBLEM GRID */}
      {filteredProblems.length === 0 ? (
        <div className="text-gray-400 text-xl">
          No problems found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredProblems.map((problem) => (
        <ProblemCard
    key={problem._id}
    problem={problem}
    status={submissionMap[problem._id]}
/>
          ))}

        </div>
      )}

    </div>
  );
}

export default Problems;