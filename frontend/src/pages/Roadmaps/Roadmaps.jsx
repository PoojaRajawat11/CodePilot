import { Link,useNavigate } from "react-router-dom";
import { roadmaps } from "../../data/roadmaps";

function Roadmaps() {
  const navigate = useNavigate();

  const openRoadmap = (id) => {
    navigate(`/roadmap/${id}`);
  };

  // get progress from localStorage
  const getProgress = (id) => {
    const data = localStorage.getItem(`roadmap-${id}`);
    if (!data) return 0;

    const completed = JSON.parse(data);

    const roadmap = roadmaps.find((r) => r.id === id);
    if (!roadmap) return 0;

    const totalSteps = roadmap.steps.length;
    if (totalSteps === 0) return 0;

    return Math.round((completed.length / totalSteps) * 100);
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
          <Link to="/dashboard">
            Dashboard
          </Link>
          <Link to="/playground">Playground</Link>
          <Link to="/roadmaps">
            Roadmaps
          </Link>   

          <Link to="/problems">
            Problems
          </Link>

          <Link to="/progress">
            Progress
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
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-400">
          Learning Roadmaps
        </h1>
        <p className="text-slate-400 mt-3">
          Choose a roadmap and start your journey
        </p>
      </div>

      {/* Empty state safety */}
      {roadmaps.length === 0 ? (
        <div className="text-center text-slate-400">
          No roadmaps available
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {roadmaps.map((roadmap) => {
            const progress = getProgress(roadmap.id);

            return (
              <div
                key={roadmap.id}
                onClick={() => openRoadmap(roadmap.id)}
                className="
                  group cursor-pointer
                  bg-slate-900 border border-slate-800
                  rounded-3xl p-6
                  hover:border-cyan-500
                  hover:shadow-lg hover:shadow-cyan-500/10
                  hover:-translate-y-2
                  transition-all duration-300
                "
              >
                {/* Title */}
                <h2 className="text-2xl font-bold group-hover:text-cyan-400 transition">
                  {roadmap.title}
                </h2>

                {/* Description */}
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                  {roadmap.description}
                </p>

                {/* Level */}
                <div className="mt-4">
                  <span className="inline-block bg-cyan-700/20 text-cyan-300 px-3 py-1 rounded-full text-xs">
                    {roadmap.level}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-cyan-400 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Topics */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {roadmap.topics.slice(0, 6).map((topic, index) => (
                    <span
                      key={index}
                      className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}

                  {roadmap.topics.length > 6 && (
                    <span className="text-xs text-slate-500 px-2 py-1">
                      +{roadmap.topics.length - 6} more
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 text-cyan-400 text-sm font-medium group-hover:underline">
                  Start Roadmap →
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Roadmaps;