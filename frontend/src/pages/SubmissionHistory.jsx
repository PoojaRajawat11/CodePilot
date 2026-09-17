import { useEffect, useState } from "react";
import axios from "axios";

function SubmissionHistory() {

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {

    const fetchSubmissions = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/ai/submissions"
        );

        setSubmissions(res.data.submissions);

      } catch (error) {
        console.log(error);
      }
    };

    fetchSubmissions();

  }, []);

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        Submission History
      </h1>

      <div className="space-y-5">

        {submissions.map((sub, index) => (

          <div
            key={index}
            className="bg-slate-900 p-5 rounded-xl border border-slate-800"
          >

            <h2 className="text-xl font-bold">
              {sub.problemTitle}
            </h2>

            <p className="text-slate-400">
              Language: {sub.language}
            </p>

            <p className={`mt-2 font-semibold
              ${sub.status === "Accepted"
                ? "text-green-400"
                : "text-red-400"}
            `}>
              {sub.status}
            </p>

            <pre className="mt-3 text-sm text-slate-300 overflow-x-auto">
              {sub.code}
            </pre>

          </div>

        ))}

      </div>

    </div>
  );
}

export default SubmissionHistory;