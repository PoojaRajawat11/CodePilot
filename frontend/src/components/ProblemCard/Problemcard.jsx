import { useNavigate } from "react-router-dom"; 

function ProblemCard({ problem, status }) {
  const navigate = useNavigate();
const problemId = problem._id;

  return (
    <div
      onClick={() => navigate(`/playground/${problemId}`)}
      className="bg-slate-900 p-6 rounded-2xl border border-slate-800 cursor-pointer hover:border-cyan-400 transition duration-300 hover:scale-[1.02]"
    >

      {/* STATUS */}
      <div className="mb-3">

        {status === "Accepted" && (
          <span className="bg-green-700 px-2 py-1 rounded text-xs">
            ✓ Solved
          </span>
        )}

        {status === "Wrong" && (
          <span className="bg-yellow-700 px-2 py-1 rounded text-xs">
            ○ Attempted
          </span>
        )}

        {!status && (
          <span className="bg-slate-700 px-2 py-1 rounded text-xs">
            Not Started
          </span>
        )}

      </div>

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        {problem.title}
      </h2>

      {/* DIFFICULTY */}
      <div className="flex items-center gap-3 mb-3">

        <span
          className={`
            px-3 py-1 rounded-full text-sm font-semibold
            ${
              problem.difficulty === "Easy"
                ? "bg-green-700"
                : problem.difficulty === "Medium"
                ? "bg-yellow-600"
                : "bg-red-700"
            }
          `}
        >
          {problem.difficulty}
        </span>

        <span className="bg-purple-700 px-3 py-1 rounded-full text-sm">
          {problem.topic}
        </span>

      </div>

      {/* COMPANIES */}
      <div className="flex flex-wrap gap-2 mt-4">
        {problem.companies?.map((company, index) => (
          <span
            key={index}
            className="bg-cyan-700 text-xs px-3 py-1 rounded-full"
          >
            {company}
          </span>
        ))}
      </div>

    </div>
  );
}

export default ProblemCard;