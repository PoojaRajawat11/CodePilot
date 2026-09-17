import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
  
function Dashboard() {
  console.log("🔥 CORRECT DASHBOARD FILE IS RUNNING");

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
const [mentorOpen, setMentorOpen] = useState(false);
const [mentorMessage, setMentorMessage] = useState("");
const [mentorMessages, setMentorMessages] = useState([]);
const [mentorLoading, setMentorLoading] = useState(false);
  // 🔐 AUTH GUARD
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login", { replace: true });
  }
}, [navigate]);

const askMentor = async () => {
  if (!mentorMessage.trim() || mentorLoading) return;

  const userMessage = {
    role: "user",
    content: mentorMessage.trim(),
  };

  const updatedMessages = [
    ...mentorMessages,
    userMessage,
  ];

  setMentorMessages(updatedMessages);
  setMentorMessage("");
  setMentorLoading(true);

  try {
    const response = await api.post(
      "/api/mentor/study-chat",
      {
        message: userMessage.content,
        history: mentorMessages,
      }
    );

    const aiMessage = {
      role: "assistant",
      content: response.data.reply,
    };

    setMentorMessages([
      ...updatedMessages,
      aiMessage,
    ]);

  } catch (error) {
    console.error("AI Mentor Error:", error);

    setMentorMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content:
          "Sorry, I couldn't connect to the AI Mentor. Please try again.",
      },
    ]);
  } finally {
    setMentorLoading(false);
  }
};



  // 📊 REAL BACKEND DATA (FIXED)

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [progressRes, problemsRes] = await Promise.all([
        api.get("/api/progress"),
        api.get("/api/problems"),
      ]);

      console.log("Progress:", progressRes.data);
      console.log("Problems:", problemsRes.data);

      setProgress(progressRes.data);
      setAllProblems(problemsRes.data);

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  fetchData();
}, []);

console.log("Progress:", progress);
console.log("Problems:", allProblems);
if (!progress) {
  return (
    <div className="min-h-screen flex justify-center items-center text-white text-2xl">
      Loading Dashboard...
    </div>
  );
}

  // 📊 STATS (FIXED)
  const stats = [
    {
      title: "Problems Solved",
      value:(progress.solvedProblems || []).length,
    },
    {
      title: "Current Streak",
      value: `${progress.currentStreak || 0} Days`,
    },
    {
      title: "Contest Rating",
      value: progress.rating || 1200,
    },
    {
      title: "Accepted",
      value: progress.passed,
    },
    {
      title: "Submissions",
      value: progress.attempts,
    },
    {
      title: "Accuracy",
      value:
        progress.attempts > 0
          ? Math.floor((progress.passed / progress.attempts) * 100) + "%"
          : "0%",
    },
  ];

  // 📊 TOPICS
  const topics = Object.entries(progress.topicStats || {}).map(
([name, value]) => ({
  name,
  progress:
    value.attempted > 0
      ? Math.floor((value.passed / value.attempted) * 100)
      : 0,
})
);

  // 📊 COMPANY STATS
  const companyStats = {};

  progress.solvedProblems.forEach((solvedTitle) => {
    const solvedProblem = allProblems.find(
  (p) => p.title === solvedTitle
);

    if (!solvedProblem) return;

    (solvedProblem.companies || []).forEach((company)=>{
      if (!companyStats[company]) {
        companyStats[company] = 0;
      }
      companyStats[company]++;
    });
  });

  const companies = Object.entries(companyStats);

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
      {/* HEADER */}
      <div className="mb-10 pl-5" >
        <h1 className="text-5xl font-bold text-cyan-400 mb-4 mt-3 ">
          Dashboard
        </h1>

        <p className="text-slate-400 text-lg">
          Track your DSA preparation and placement journey.
        </p>
      </div>
{/* QUICK ACTIONS */}
<div className="mb-14">
  <h2 className="text-3xl font-bold text-cyan-400 mb-6">
    Quick Actions
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

    {/* PLAYGROUND */}
    <Link
      to="/playground"
      className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-2xl hover:scale-105 transition duration-300 shadow-lg"
    >
      <div className="text-5xl mb-4">💻</div>

      <h3 className="text-xl font-bold text-white">
        Playground
      </h3>

      <p className="text-slate-200 mt-2">
        Practice & run code
      </p>
    </Link>

    {/* PROGRESS */}
    <Link
      to="/progress"
      className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl hover:scale-105 transition duration-300 shadow-lg"
    >
      <div className="text-5xl mb-4">📈</div>

      <h3 className="text-xl font-bold text-white">
        Progress
      </h3>

      <p className="text-slate-200 mt-2">
        Track your journey
      </p>
    </Link>

    {/* PROBLEMS */}
    <Link
      to="/problems"
      className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl hover:scale-105 transition duration-300 shadow-lg"
    >
      <div className="text-5xl mb-4">🧩</div>

      <h3 className="text-xl font-bold text-white">
        Problems
      </h3>

      <p className="text-slate-200 mt-2">
        Solve DSA Questions
      </p>
    </Link>

    {/* ROADMAPS */}
    <Link
      to="/roadmaps"
      className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl hover:scale-105 transition duration-300 shadow-lg"
    >
      <div className="text-5xl mb-4">🗺️</div>

      <h3 className="text-xl font-bold text-white">
        Roadmaps
      </h3>

      <p className="text-slate-200 mt-2">
        Learn step-by-step
      </p>
    </Link>

    {/* AI MENTOR */}
    <button
      type="button"
      onClick={() => {
        console.log("AI Mentor clicked");
        setMentorOpen(true);
      }}
      className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 p-6 rounded-2xl hover:scale-105 transition duration-300 shadow-lg text-left"
    >
      <div className="text-5xl mb-4">🤖</div>

      <h3 className="text-xl font-bold text-white">
        AI Mentor
      </h3>

      <p className="text-slate-200 mt-2">
        Ask anything about your studies
      </p>
    </button>

  </div>
</div>
      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
          >
            <h2 className="text-slate-400 text-lg mb-3">
              {stat.title}
            </h2>
            <p className="text-4xl font-bold text-cyan-400">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* COMPANY SHEETS */}
      <div className="mt-14">
        <h2 className="text-4xl font-bold text-cyan-400 mb-8">
          Company Wise DSA Sheets
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Link to="/company/Amazon" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-400">
            Amazon
          </Link>

          <Link to="/company/Google" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-400">
            Google
          </Link>

          <Link to="/company/Microsoft" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-400">
            Microsoft
          </Link>

          <Link to="/company/Adobe" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-400">
            Adobe
          </Link>

        </div>
      </div>

      {/* TOPIC PROGRESS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-14">
        <h2 className="text-3xl font-bold mb-8">
          Topic Progress
        </h2>

        {topics.length === 0 ? (
          <p className="text-slate-400">
            No topic data yet.
          </p>
        ) : (
          <div className="space-y-6">
            {topics.map((topic, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <p className="text-lg">{topic.name}</p>
                  <p className="text-cyan-400">
                    {topic.progress}%
                  </p>
                </div>

                <div className="w-full bg-slate-800 h-4 rounded-full">
                  <div
                    className="bg-cyan-400 h-4 rounded-full"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPANY PROGRESS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-14">
        <h2 className="text-3xl font-bold mb-8">
          Company Preparation
        </h2>

        {companies.length === 0 ? (
          <p className="text-slate-400">
            No company data yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(([company, count], index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  {company}
                </h3>
                <p className="text-slate-300">
                  Problems Solved: {count}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-8">
          Recent Activity
        </h2>

        {(progress.activities || []).length === 0 ? (
          <p className="text-slate-400">
            No activity yet.
          </p>
        ) : (
          <div className="space-y-5">
            {progress.activities
              .slice(-5)
              .reverse()
              .map((a, i) => (
                <div
                  key={i}
                  className="bg-slate-800 p-5 rounded-2xl"
                >
                  {a.type} "{a.problem}"
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">

   {/* <div className="bg-gray-900 p-5 rounded-xl">
    <h3>Total Tasks</h3>
    <p className="text-3xl font-bold">
      {plan?.tasks?.length || 0}
    </p>
  </div>
  
  <div className="bg-gray-900 p-5 rounded-xl">
    <h3>Weak Topics</h3>
    <p className="text-3xl font-bold">
      {plan?.weakTopics?.length || 0}
    </p>
  </div>

  <div className="bg-gray-900 p-5 rounded-xl">
    <h3>Completed</h3>
    <p className="text-3xl font-bold">
      {
        plan?.tasks?.filter(
          t => t.completed
        ).length
      }
    </p>
  </div>*/}

</div> 
{/* AI MENTOR POPUP */}
{mentorOpen && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

    <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b border-slate-700">

        <div>
          <h2 className="text-2xl font-bold text-cyan-400">
            🤖 CodePilot AI Mentor
          </h2>

          <p className="text-sm text-slate-400">
            Ask anything about your Computer Science studies
          </p>
        </div>

        <button
          onClick={() => setMentorOpen(false)}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>

      </div>

      {/* CHAT AREA */}
      <div className="h-96 overflow-y-auto p-5 space-y-4">

        {mentorMessages.length === 0 && (
          <div className="bg-slate-800 rounded-xl p-4">

            <p className="text-cyan-400 font-semibold mb-2">
              AI Mentor
            </p>

            <p className="text-gray-300">
              Hi! 👋 I'm your CodePilot AI Mentor.
              Ask me anything about DSA, Java, DBMS,
              Operating Systems, Computer Networks,
              programming, interviews, or other CS topics.
            </p>

          </div>
        )}

        {mentorMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] p-4 rounded-xl ${
                message.role === "user"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-gray-200"
              }`}
            >

              <p className="text-xs opacity-60 mb-1">
                {message.role === "user"
                  ? "You"
                  : "AI Mentor"}
              </p>

              <p className="whitespace-pre-wrap">
                {message.content}
              </p>

            </div>

          </div>
        ))}

        {mentorLoading && (
          <div className="bg-slate-800 p-4 rounded-xl max-w-[80%]">
            <p className="text-gray-400">
              AI Mentor is thinking...
            </p>
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="p-5 border-t border-slate-700">

        <textarea
          value={mentorMessage}
          onChange={(e) =>
            setMentorMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              e.ctrlKey
            ) {
              askMentor();
            }
          }}
          placeholder="Ask your AI Mentor anything..."
          className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-cyan-400 resize-none"
        />

        <div className="flex justify-between items-center mt-3">

          <p className="text-xs text-slate-500">
            Ctrl + Enter to send
          </p>

          <button
            onClick={askMentor}
            disabled={
              mentorLoading ||
              !mentorMessage.trim()
            }
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {mentorLoading
              ? "Thinking..."
              : "Ask Mentor"}
          </button>

        </div>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default Dashboard;