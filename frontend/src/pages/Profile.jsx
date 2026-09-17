import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const handleLogout = () => {
  // Remove saved data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Go back to home page
  navigate("/");
};
  const [progress, setProgress] = useState(null);
  const [allProblems, setAllProblems] = useState([]);

  // 🔐 AUTH GUARD
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { replace: true });
  }
}, [navigate]);  


  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-white">
        Loading Profile...
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-slate-950 text-white">
    <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          CodePilot AI
        </h1>

       <div className="flex items-center gap-6 text-lg">
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
 <button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Logout
</button>
        </div>
      </nav>
    <div className="p-6 text-white">

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        👤 Profile Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2 className="text-slate-400">
            Total Problems
          </h2>

          <p className="text-3xl font-bold mt-2">
            {data.totalProblems}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2 className="text-slate-400">
            Accepted
          </h2>

          <p className="text-3xl font-bold text-green-400 mt-2">
            {data.accepted}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2 className="text-slate-400">
            Accuracy
          </h2>

          <p className="text-3xl font-bold text-cyan-400 mt-2">
            {data.accuracy}%
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl">
          <h2 className="text-slate-400">
            Streak
          </h2>

          <p className="text-3xl font-bold text-orange-400 mt-2">
            🔥 {data.currentStreak}
          </p>

          <p className="text-sm text-slate-400">
            Best: {data.longestStreak}
          </p>
        </div>

      </div>

      {/* ACHIEVEMENTS */}
      <div className="bg-slate-900 p-5 rounded-xl mb-8">

        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          🏅 Achievements
        </h2>

        <div className="grid md:grid-cols-2 gap-3">

          {data.accepted >= 1 && (
            <div className="bg-slate-800 p-3 rounded-lg">
              🎉 First Accepted
            </div>
          )}

          {data.accepted >= 10 && (
            <div className="bg-slate-800 p-3 rounded-lg">
              🔥 10 Problems Solved
            </div>
          )}

          {data.accepted >= 50 && (
            <div className="bg-slate-800 p-3 rounded-lg">
              🚀 50 Problems Solved
            </div>
          )}

          {data.currentStreak >= 7 && (
            <div className="bg-slate-800 p-3 rounded-lg">
              ⚡ 7 Day Streak
            </div>
          )}

          {data.currentStreak >= 30 && (
            <div className="bg-slate-800 p-3 rounded-lg">
              👑 30 Day Streak
            </div>
          )}

        </div>

      </div>

      {/* WEAK TOPICS */}
      <div className="bg-slate-900 p-5 rounded-xl mb-8">

        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          🧠 Weak Topics
        </h2>

        {data.weakTopics?.length > 0 ? (
          data.weakTopics.map((topic, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-slate-700 py-2"
            >
              <span>{topic.topic}</span>

              <span>
                {topic.accuracy}%
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400">
            No topic data available.
          </p>
        )}

      </div>

      {/* RECENT SUBMISSIONS */}
      <div className="bg-slate-900 p-5 rounded-xl">

        <h2 className="text-2xl font-bold text-green-400 mb-4">
          📜 Recent Submissions
        </h2>

        {data.recent?.length > 0 ? (
          data.recent.map((submission, index) => (
            <div
              key={index}
              className="border-b border-slate-700 py-3"
            >
              <p className="font-semibold">
                {submission.problemTitle}
              </p>

              <p className="text-sm text-slate-400">
                {submission.status} • {submission.language}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-400">
            No submissions yet.
          </p>
        )}

      </div>

    </div>
    </div>
  );
}

export default Profile;