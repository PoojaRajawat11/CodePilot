import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { roadmaps } from "../../data/roadmaps";
import API from "../../api";

function RoadmapDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const roadmap = roadmaps.find((r) => r.id === Number(id));

  const storageKey = `roadmap-progress-${id}`;

  // =========================
  // LOCAL PROGRESS STATE
  // =========================
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // =========================
  // AI ROADMAP STATE (NEW)
  // =========================
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed, storageKey]);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        Roadmap not found
      </div>
    );
  }

  // =========================
  // TOGGLE STEP (SAFE)
  // =========================
  const toggleStep = (step, index) => {
    const key = typeof step === "object" ? step.id || index : index;

    setCompleted((prev) =>
      prev.includes(key)
        ? prev.filter((i) => i !== key)
        : [...prev, key]
    );
  };

  const totalSteps = roadmap.steps?.length || 0;

  const progress =
    totalSteps === 0
      ? 0
      : Math.round((completed.length / totalSteps) * 100);

  // =========================
  // AI ROADMAP GENERATOR
  // =========================
  const generateAIRoadmap = async () => {
    try {
      setLoadingAI(true);

      const res = await API.post("/ai-roadmap", {
        company: roadmap.title,
      });

      setAiRoadmap(res.data.roadmap);
    } catch (err) {
      console.log("AI Roadmap Error:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* Back Button */}
      <button
        onClick={() => navigate("/roadmaps")}
        className="mb-6 text-cyan-400 hover:underline"
      >
        ← Back to Roadmaps
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-cyan-400">
        {roadmap.title}
      </h1>

      <p className="text-slate-400 mt-2">
        {roadmap.description}
      </p>

      <span className="inline-block mt-4 bg-cyan-700/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
        {roadmap.level}
      </span>

      {/* AI BUTTON */}
      <button
        onClick={generateAIRoadmap}
        className="mt-6 bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600"
      >
        Generate AI Roadmap
      </button>

      {/* AI LOADING */}
      {loadingAI && (
        <p className="mt-4 text-cyan-400">
          Generating AI roadmap...
        </p>
      )}

      {/* AI OUTPUT */}
      {aiRoadmap && (
        <div className="mt-6 bg-slate-900 border border-cyan-700 p-6 rounded-xl whitespace-pre-line">
          <h2 className="text-xl font-bold text-cyan-400 mb-3">
            AI Personalized Roadmap
          </h2>
          {aiRoadmap}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="w-full bg-slate-800 h-3 rounded-full">
          <div
            className="bg-cyan-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm mt-2 text-slate-300">
          Progress: {progress}%
        </p>
      </div>

      {/* Steps */}
      <div className="mt-10 space-y-4">
        {roadmap.steps.map((step, index) => {
          const stepKey =
            typeof step === "object"
              ? step.id || index
              : index;

          const isDone = completed.includes(stepKey);

          const title =
            typeof step === "object" ? step.title : step;

          return (
            <div
              key={stepKey}
              onClick={() => toggleStep(step, index)}
              className={`p-4 rounded-xl border cursor-pointer transition
                ${
                  isDone
                    ? "bg-green-900/20 border-green-500"
                    : "bg-slate-900 border-slate-700"
                }
              `}
            >
              <div className="flex gap-3 items-center">
                <input type="checkbox" checked={isDone} readOnly />

                <span className={isDone ? "line-through text-slate-400" : ""}>
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setCompleted([]);
          localStorage.removeItem(storageKey);
        }}
        className="mt-10 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Reset Progress
      </button>
    </div>
  );
}

export default RoadmapDetails;