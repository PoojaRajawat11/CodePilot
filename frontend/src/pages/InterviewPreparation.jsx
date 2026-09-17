import { useNavigate } from "react-router-dom";

function InterviewPreparation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-400 mb-3">
          Interview Preparation
        </h1>

        <p className="text-slate-400 mb-10">
          Practice different types of interviews with your AI interviewer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* HR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🧑‍💼</div>

            <h2 className="text-2xl font-bold mb-2">
              HR Interview
            </h2>

            <p className="text-slate-400 mb-5">
              Practice common HR and behavioral interview questions.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/hr")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

          {/* Technical */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">💻</div>

            <h2 className="text-2xl font-bold mb-2">
              Technical Interview
            </h2>

            <p className="text-slate-400 mb-5">
              Practice programming and technical interview questions.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/technical")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

          {/* CS Core */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">📚</div>

            <h2 className="text-2xl font-bold mb-2">
              CS Core
            </h2>

            <p className="text-slate-400 mb-5">
              Practice DBMS, OS, Computer Networks, OOP and other core subjects.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/cs-core")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

          {/* DSA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🧠</div>

            <h2 className="text-2xl font-bold mb-2">
              DSA Interview
            </h2>

            <p className="text-slate-400 mb-5">
              Practice conceptual DSA interview questions.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/dsa")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

          {/* Verbal */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🗣️</div>

            <h2 className="text-2xl font-bold mb-2">
              Verbal & Communication
            </h2>

            <p className="text-slate-400 mb-5">
              Improve your communication and interview answering skills.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/verbal")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

          {/* Full Mock */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-4xl mb-4">🎤</div>

            <h2 className="text-2xl font-bold mb-2">
              Full Mock Interview
            </h2>

            <p className="text-slate-400 mb-5">
              Experience a complete interview with multiple question types.
            </p>

            <button
              onClick={() =>
                navigate("/interview-preparation/setup/mixed")
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg"
            >
              Start
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InterviewPreparation;