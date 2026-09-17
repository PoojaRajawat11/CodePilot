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

      try {
        const res = await axios.get(
          "http://localhost:5000/api/mentor/today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlan(res.data);
      } catch {
        const res = await axios.get(
          "http://localhost:5000/api/mentor/generate",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlan(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Loading AI Mentor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        🧠 AI Mentor Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-gray-400">
            Total Tasks
          </h3>

          <p className="text-3xl font-bold">
            {plan?.tasks?.length || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-gray-400">
            Weak Topics
          </h3>

          <p className="text-3xl font-bold">
            {plan?.weakTopics?.length || 0}
          </p>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-gray-400">
            Completed
          </h3>

          <p className="text-3xl font-bold">
            {
              plan?.tasks?.filter(
                (task) => task.completed
              ).length
            }
          </p>
        </div>

      </div>

      {/* Weak Topics */}
      <div className="bg-gray-900 p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Weak Topics
        </h2>

        <div className="flex gap-2 flex-wrap">

          {plan?.weakTopics?.length > 0 ? (
            plan.weakTopics.map((topic, index) => (
              <span
                key={index}
                className="bg-red-600 px-3 py-1 rounded-full"
              >
                {topic}
              </span>
            ))
          ) : (
            <p>No weak topics detected yet.</p>
          )}

        </div>
      </div>

      {/* Today's Plan */}
      <div className="bg-gray-900 p-5 rounded-xl">

        <h2 className="text-xl font-semibold mb-4">
          Today's AI Plan
        </h2>

        <div className="space-y-3">

          {plan?.tasks?.length > 0 ? (
            plan.tasks.map((task, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg flex justify-between"
              >
                <div>
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

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
            ))
          ) : (
            <p>No tasks generated yet.</p>
          )}

        </div>

      </div>
    </div>
  );
}