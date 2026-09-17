import { useEffect, useState } from "react";
import axios from "axios";

function DailyProblems() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/ai/daily-problems",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(res.data);
    };

    fetchData();
  }, []);

  if (!data) return <div className="text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl text-cyan-400 mb-4">
        🧠 Daily AI Practice
      </h1>

      <div className="mb-6">
        <h2 className="text-xl">Weak Topics</h2>
        {data.weakTopics.map((t, i) => (
          <p key={i}>
            {t.topic} - {(t.weakness * 100).toFixed(0)}%
          </p>
        ))}
      </div>

      <pre className="bg-slate-900 p-4 rounded-xl whitespace-pre-wrap">
        {data.dailyPlan}
      </pre>
    </div>
  );
}

export default DailyProblems;