import { useEffect, useState } from "react";
import api from "../services/api";

const WeakTopics = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/ai/weak-topics");
      setData(res.data.data);
    };

    fetchData();
  }, []);
const getSuggestion = (topic, score) => {
  if (score < 30) return "Strong area 💪 Keep practicing problems.";

  if (score < 60)
    return `⚠ You are weak in ${topic}. Practice 5–10 problems daily.`;

  return `🔥 Critical weakness in ${topic}. Focus on fundamentals first.`;
};
  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-4">
        Weak Topics Tracker
      </h1>

      {data.map((item) => (
        <div
          key={item.topic}
          className="bg-slate-900 p-4 rounded-xl mb-3 border border-slate-700"
        >
          <h2 className="text-xl font-semibold">
            {item.topic}
          </h2>

          
    <p className="text-red-400">
      Weakness: {item.weakScore.toFixed(2)}%
    </p>

    <p className="text-yellow-400 mt-2">
      {getSuggestion(item.topic, item.weakScore)}
    </p>
        </div>
      ))}

    </div>
  );
};

export default WeakTopics;