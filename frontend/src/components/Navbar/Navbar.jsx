import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 px-8 py-4 flex justify-between items-center">

      {/* LOGO */}
      <h1 className="text-3xl font-bold text-cyan-400">
        CodePilot AI
      </h1>

      {/* NAV LINKS */}
      <div className="flex gap-6 items-center text-white">

        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/playground">Playground</Link>
        <Link to="/roadmaps">Roadmaps</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/progress"className="hover:text-cyan-400">Progress</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/interview-preparation">
  Interview
</Link>
        <Link
  to="/mentor"
  className="block p-3 rounded-lg bg-purple-700"
>
  AI Mentor
</Link>

        {/* LOGOUT (ONLY IF LOGGED IN) */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;