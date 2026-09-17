import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      console.log("REGISTER REQUEST:", {
        name,
        email,
        password,
      });

      const res = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });

      console.log("REGISTER SUCCESS:", res.data);

      alert("Registration successful");

      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
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

      {/* Form */}
      <div className="min-h-screen flex justify-center items-center">

        <form
          onSubmit={handleRegister}
          className="bg-slate-800 p-10 rounded-2xl w-[400px]"
        >

          <h2 className="text-3xl font-bold mb-6 text-center">
            Register
          </h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-lg mb-4 bg-slate-700"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg mb-4 bg-slate-700"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg mb-6 bg-slate-700"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 p-3 rounded-lg"
          >
            Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;