import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Leaderboard() {
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

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ai/leaderboard"
      );

      setLeaders(
        res.data.leaderboard || []
      );

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading Leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
{/* NAVBAR */}
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
        🏆 Leaderboard
      </h1>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-700">

              <th className="text-left py-3">
                Rank
              </th>

              <th className="text-left py-3">
                User
              </th>

              <th className="text-left py-3">
                Solved
              </th>

            </tr>
          </thead>

          <tbody>

            {leaders.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-slate-800"
              >

                <td className="py-4 font-bold">
                  #{index + 1}
                </td>

                <td className="py-4">
  {user.username}
</td>

                <td className="py-4 text-green-400 font-bold">
                  {user.solved}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
    </div>
  );
}

export default Leaderboard;