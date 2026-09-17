import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ProgressChart({ data }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Progress Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#00ffff"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="submissions"
            stroke="#facc15"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default ProgressChart;