import api from "../../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [dailyChallenge, setDailyChallenge] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      const res = await api.get("/api/ai/daily-challenge");
      setDailyChallenge(res.data.challenge);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-cyan-400">
          CodePilot AI
        </h1>

  <div className="flex items-center gap-6 text-lg">

    <Link to="/">Home</Link>

    {token && (
      <>
        <Link to="/dashboard">Dashboard</Link>
      </>
    )}

    <Link to="/playground">Playground</Link>

    <Link to="/problems">Problems</Link>

    {token && (
      <>

        <Link to="/profile">Profile</Link>
<Link to="/interview-preparation">
  Interview
</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </>
    )}

    {!token ? (
      <>
        <Link to="/login">Login</Link>

        <Link to="/register">Register</Link>
      </>
    ) : (
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition"
      >
        Logout
      </button>
    )}

  </div>

</nav>

      {/* HERO */}
      <div className="flex flex-col justify-center items-center text-center min-h-[80vh] px-6">

        <h1 className="text-7xl font-bold text-cyan-400 mb-6">
          Crack Placements with AI
        </h1>

        <p className="text-slate-300 text-xl max-w-3xl mb-10">
          Learn DSA with brute force and optimal solutions,
          AI explanations, company-wise preparation,
          coding analytics, mock interviews and
          personalized learning.
        </p>

        <div className="flex gap-6">

          <Link
            to="/register"
            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-cyan-400 px-8 py-4 rounded-2xl text-lg"
          >
            Login
          </Link>

        </div>

        {/* DAILY CHALLENGE */}

        {dailyChallenge && (

          <div className="mt-16 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full">

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              🔥 Daily Challenge
            </h2>

            <h3 className="text-2xl font-bold mb-3">
              {dailyChallenge.title}
            </h3>

            <div className="flex justify-center gap-3 mb-5">

              <span className="bg-cyan-700 px-3 py-1 rounded-full">
                {dailyChallenge.topic}
              </span>

              <span className="bg-purple-700 px-3 py-1 rounded-full">
                {dailyChallenge.difficulty}
              </span>

            </div>

            <Link
              to={`/problem/${dailyChallenge._id}`}
              className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl inline-block"
            >
              Solve Challenge 🚀
            </Link>

          </div>

        )}

      </div>

    </div>
  );
}

export default Home;