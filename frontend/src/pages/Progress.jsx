import { useEffect, useState } from "react";
import axios from "axios";
import ProgressChart from "../components/ProgressChart";

function Progress() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [filter, setFilter] = useState("7");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [filter]);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // Progress Chart + Stats
      const res = await axios.get(
        `http://localhost:5000/api/ai/progress-chart?days=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data.stats || {});
      setData(res.data.chartData || []);

      // Weak Topics
      const weakRes = await axios.get(
        "http://localhost:5000/api/ai/weak-topics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWeakTopics(weakRes.data.data || []);

      // Recent Submissions
      const submissionsRes = await axios.get(
        "http://localhost:5000/api/ai/submissions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions(
        submissionsRes.data.submissions || []
      );

    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">
        📊 Progress Dashboard
      </h1>

      {/* FILTER */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 px-4 py-2 rounded-lg"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">
            Total Submissions
          </h3>

          <p className="text-3xl font-bold mt-2">
            {stats?.totalSubmissions || 0}
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">
            Accepted
          </h3>

          <p className="text-3xl font-bold text-green-400 mt-2">
            {stats?.accepted || 0}
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">
            Accuracy
          </h3>

          <p className="text-3xl font-bold text-cyan-400 mt-2">
            {stats?.accuracy || 0}%
          </p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">

        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          📈 Progress Trend
        </h2>

        <ProgressChart data={data} />

      </div>

      {/* WEAK TOPICS */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          🧠 Weak Topics Analysis
        </h2>

        {weakTopics.length === 0 ? (
          <p className="text-slate-400">
            No topic data available yet.
          </p>
        ) : (
          <div className="space-y-3">

            {weakTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"
              >
                <span className="font-semibold">
                  {topic.topic}
                </span>

                <span
                  className={
                    topic.accuracy >= 80
                      ? "text-green-400 font-bold"
                      : topic.accuracy >= 50
                      ? "text-yellow-400 font-bold"
                      : "text-red-400 font-bold"
                  }
                >
                  {topic.accuracy}%
                </span>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* RECENT SUBMISSIONS */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          📜 Recent Submissions
        </h2>

        {submissions.length === 0 ? (
          <p className="text-slate-400">
            No submissions found.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3">
                    Problem
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                  <th className="text-left py-3">
                    Language
                  </th>

                  <th className="text-left py-3">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>

                {submissions
                  .slice(0, 10)
                  .map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-slate-800"
                    >
                      <td className="py-3">
                        {sub.problemTitle}
                      </td>

                      <td
                        className={`py-3 font-semibold ${
                          sub.status === "Accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {sub.status}
                      </td>

                      <td className="py-3">
                        {sub.language}
                      </td>

                      <td className="py-3">
                        {new Date(
                          sub.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Progress;