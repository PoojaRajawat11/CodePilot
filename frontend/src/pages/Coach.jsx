import { useEffect, useState } from "react";
import axios from "axios";

function Coach() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCoach = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/ai/coach",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(res.data.coach);
    };

    fetchCoach();
  }, []);

  if (!data) {
    return <div className="text-white p-6">Loading Coach...</div>;
  }

  return (
    <div className="p-8 text-white space-y-6">

      <h1 className="text-4xl text-cyan-400 font-bold">
        🧠 Personal Coach Mode
      </h1>

      {/* IMPROVEMENT RATE */}
      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-xl">📈 Improvement Rate</h2>
        <p className="text-3xl text-green-400">
          {data.improvementRate}%
        </p>
      </div>

      {/* DAILY PLAN */}
      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-xl mb-3">📅 Daily Plan</h2>

        {data.dailyProblems.map((d, i) => (
          <div key={i} className="border-b border-slate-700 py-2">
            Day {d.day}: {d.topic} → {d.focus}
          </div>
        ))}
      </div>

      {/* REVISION PLAN */}
      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-xl mb-3">🗺 Revision Plan</h2>

        {data.revisionPlan.map((r, i) => (
          <div key={i} className="py-2">
            <p>
              {r.topic} - {r.priority}
            </p>
            <p className="text-slate-400">{r.suggestion}</p>
          </div>
        ))}
      </div>

      {/* WEAK TOPICS */}
      <div className="bg-slate-900 p-4 rounded-xl">
        <h2 className="text-xl mb-3">⚠ Weak Topics</h2>

        {data.weakTopics.map((w, i) => (
          <div key={i} className="flex justify-between">
            <span>{w.topic}</span>
            <span>{w.accuracy}%</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Coach;