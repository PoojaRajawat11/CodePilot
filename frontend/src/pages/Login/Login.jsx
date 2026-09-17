import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔥 DEBUG INPUTS
      console.log("LOGIN REQUEST:", { email });

      // ❌ VALIDATION (prevents 400 from empty request)
      if (!email.trim() || !password.trim()) {
        alert("Email and password are required");
        setLoading(false);
        return;
      }

      // 🔥 API CALL
      console.log("🔥 ABOUT TO SEND LOGIN");
      const res = await API.post("/api/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ❌ SAFE TOKEN CHECK
      if (!res.data || !res.data.token) {
        alert("Login failed: No token received from backend");
        setLoading(false);
        return;
      }

      // 💾 SAVE TOKEN
console.log("Response:", res.data);

localStorage.setItem("token", res.data.token);

if (res.data.user) {
  localStorage.setItem("user", JSON.stringify(res.data.user));
}

console.log("After save:", localStorage.getItem("token"));

// Redirect to dashboard
navigate("/dashboard");
// Stop here for debugging
return; 

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Login failed. Check email/password or backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          CodePilot AI
        </h1>

        <div className="flex gap-6 text-lg">

          <Link to="/">
            Home
          </Link>

          <Link to="/problems">
            Problems
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

      {/* FORM */}
      <div className="min-h-screen flex justify-center items-center">

        <form
          onSubmit={handleLogin}
          className="bg-slate-800 p-10 rounded-2xl w-[400px]"
        >

          <h2 className="text-3xl font-bold mb-6 text-center">
            Login
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg mb-4 bg-slate-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg mb-6 bg-slate-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 p-3 rounded-lg hover:bg-cyan-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;