import { useEffect, useState } from "react";
import axios from "axios";

export default function Mentor() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentorData();
  }, []);

  const loadMentorData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/mentor/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlan(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading AI Mentor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-6">
        🧠 AI Mentor
      </h1>

      {/* Weak Topics */}
      <div className="bg-gray-900 rounded-xl p-5 mb-6">

        <h2 className="text-xl font-semibold mb-3">
          Weak Topics
        </h2>

        <div className="flex gap-2 flex-wrap">
          {plan?.weakTopics?.map((topic, index) => (
            <span
              key={index}
              className="bg-red-600 px-3 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>

      </div>

      {/* Daily Plan */}
      <div className="bg-gray-900 rounded-xl p-5">

        <h2 className="text-xl font-semibold mb-3">
          Today's Plan
        </h2>

        <div className="space-y-3">

          {plan?.tasks?.map((task, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-semibold">
                  {task.title}
                </p>

                <p className="text-sm text-gray-400">
                  {task.topic}
                </p>
              </div>

              <span
                className={
                  task.completed
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}