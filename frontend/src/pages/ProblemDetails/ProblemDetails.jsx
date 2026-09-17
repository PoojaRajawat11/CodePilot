import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { interviewAI, mockInterview } from "../../utils/ai";
import { useProgress } from "../../hooks/useProgress";

function ProblemDetails() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [hint, setHint] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [loadingHint, setLoadingHint] = useState(false);

  const [interview, setInterview] = useState("");
  const [showInterview, setShowInterview] = useState(false);
  const [loadingInterview, setLoadingInterview] = useState(false);

  const [mockInterviewText, setMockInterviewText] = useState("");
  const [showMock, setShowMock] = useState(false);
const [activeTab, setActiveTab] = useState("problem");
const [approaches, setApproaches] = useState([]);
const [interviewSession, setInterviewSession] =
  useState(null);

const [currentQuestion, setCurrentQuestion] =
  useState(0);
  const [submissionId, setSubmissionId] =
  useState(null);
const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);

  const { progress } = useProgress();

  const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
  };

  // ---------------- FETCH FROM BACKEND ----------------
  useEffect(() => {
    const fetchProblem = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/problem/${id}`
    );

    setProblem(res.data);

    const approachRes = await axios.get(
      `http://localhost:5000/api/problem/${id}/approaches`
    );

    if (
      approachRes.data.approaches.length === 0
    ) {
      setApproaches([
        {
          title: "Brute Force",
          explanation:
            res.data.bruteForce,
          timeComplexity:
            res.data.complexity?.brute,
          spaceComplexity: "",

          code: {
            javascript:
              res.data.bruteForce,
            python: "",
            java: "",
            cpp: "",
          },
        },
        {
          title: "Optimal",
          explanation:
            res.data.optimal,
          timeComplexity:
            res.data.complexity?.optimal,
          spaceComplexity: "",

          code: {
            javascript:
              res.data.optimal,
            python: "",
            java: "",
            cpp: "",
          },
        },
      ]);
    } else {
      setApproaches(
        approachRes.data.approaches
      );
    }

    setCode(
      res.data.starterCode?.javascript || ""
    );
  } catch (err) {
    console.log(
      "Error fetching problem:",
      err
    );
  }
};

    fetchProblem();
  }, [id]);

  // ---------------- LANGUAGE CHANGE ----------------
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode?.[language] || "");
    }
  }, [language, problem]);

  if (!problem) {
    return (
      <div className="text-white p-10 text-2xl">
        Loading Problem...
      </div>
    );
  }

  // ---------------- BUILD CODE ----------------
  const buildCode = (test) => {
    return `${code}

console.log(solution(${JSON.stringify(test.input)}));`;
  };

  // ---------------- RUN CODE ----------------
  const runCode = async () => {
    try {
      setOutput("Running...");

      const test = problem.visibleTests[0];

      const response = await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: buildCode(test),
          language_id: languageMap[language],
        }
      );

      const result =
        response.data.stdout ||
        response.data.stderr ||
        response.data.compile_output;

      setOutput(result);
    } catch (err) {
      setOutput("Execution Error ❌");
    }
  };

  // ---------------- SUBMIT CODE ----------------
  const handleSubmit = async () => {
  try {
    setOutput("Submitting...");

    const tests = [
  ...(problem.visibleTests || []),
  ...(problem.hiddenTests || []),
];

    const results = await Promise.all(
      tests.map(async (test, i) => {
        const response = await axios.post(
          "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
          {
            source_code: buildCode(test),
            language_id: languageMap[language],
          }
        );

        const output =
          response.data.stdout?.trim() || "";

        return {
          index: i,
          passed: output === test.expected,
        };
      })
    );

    let passed = 0;
    let resultText = "";

    results.forEach((r) => {
      if (r.passed) {
        passed++;
        resultText += `Test ${r.index + 1}: Passed ✅\n`;
      } else {
        resultText += `Test ${r.index + 1}: Failed ❌\n`;
      }
    });

    if (passed === tests.length) {
      setOutput(
        `Accepted 🎉 ${passed}/${tests.length}\n\n${resultText}`
      );

      const submissionRes = await axios.post(
  "http://localhost:5000/api/ai/save-submission",
  {
    problemId: problem._id,
    language,
    code,
    status: "Accepted",
    topic: problem.topic,
    userId: JSON.parse(
      atob(
        localStorage
          .getItem("token")
          .split(".")[1]
      )
    ).id,
  }
);
setSubmissionId(
  submissionRes.data.submission._id
);
    } else {
      setOutput(
        `Wrong Answer ❌ ${passed}/${tests.length}\n\n${resultText}`
      );
    }
  } catch (err) {
    console.log(err);
    setOutput("Submission Error ❌");
  }
};
  const startInterview = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/interview/start",
      {
        submissionId,
        problemId: problem._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setInterviewSession(
      res.data.session
    );

  } catch (err) {
    console.log(err);
  }
};
const submitAnswer = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/interview/answer",
      {
        sessionId: interviewSession._id,
        questionIndex: currentQuestion,
        answer,
      }
    );

    setAnswer("");

    if (
      currentQuestion <
      interviewSession.questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }

  } catch (err) {
    console.log(err);
  }
};
// ---------------- UI ----------------
return (
  <div className="flex h-screen bg-slate-950 text-white">

    {/* LEFT */}
    <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-800">

      <h1 className="text-4xl font-bold text-cyan-400 mb-4">
        {problem.title}
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">

        <button
          onClick={() => setActiveTab("problem")}
          className="bg-slate-800 px-3 py-1 rounded"
        >
          Problem
        </button>

        {approaches.map((app, index) => (
  <button
    key={index}
    onClick={() =>
      setActiveTab(`approach-${index}`)
    }
    className="bg-slate-800 px-3 py-1 rounded"
  >
    {app.title}
  </button>
))}

        <button
          onClick={() => setActiveTab("tips")}
          className="bg-slate-800 px-3 py-1 rounded"
        >
          Tips
        </button>

        <button
          onClick={() => setActiveTab("mistakes")}
          className="bg-slate-800 px-3 py-1 rounded"
        >
          Mistakes
        </button>

      </div>

      {/* Content */}
      <div className="bg-slate-900 p-4 rounded-lg mb-6">

        {activeTab === "problem" && (
          <div>

            <p className="text-slate-300 mb-4">
              {problem.description}
            </p>

            <h3 className="font-bold text-lg mb-2">
              Constraints
            </h3>

            <ul className="list-disc ml-5 mb-4">
              {problem.constraints?.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <h3 className="font-bold text-lg mb-2">
              Examples
            </h3>

            <div className="space-y-3">
              {problem.examples?.map((example, index) => (
                <div
                  key={index}
                  className="bg-black p-3 rounded"
                >
                  <p>
                    <strong>Input:</strong> {example.input}
                  </p>

                  <p>
                    <strong>Output:</strong> {example.output}
                  </p>

                  <p>
                    <strong>Explanation:</strong>{" "}
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {approaches.map((app, index) => (
  activeTab === `approach-${index}` && (
    <div key={index}>

      <h2 className="text-2xl font-bold text-cyan-400 mb-3">
        {app.title}
      </h2>

      <p className="mb-4">
        {app.explanation}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">

        <div className="bg-slate-800 p-3 rounded">
          <strong>Time:</strong>
          <br />
          {app.timeComplexity}
        </div>

        <div className="bg-slate-800 p-3 rounded">
          <strong>Space:</strong>
          <br />
          {app.spaceComplexity}
        </div>

      </div>

      <pre className="bg-black p-4 rounded overflow-auto">
        {app.code?.[language]}
      </pre>

    </div>
  )
))}

        {activeTab === "tips" && (
          <ul className="list-disc ml-5">
            {problem.interviewTips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        )}

        {activeTab === "mistakes" && (
          <ul className="list-disc ml-5">
            {problem.mistakes?.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}

      </div>

      {/* Complexity */}
      <div className="bg-slate-800 p-4 rounded mb-6">

        <h3 className="font-bold mb-2">
          Complexity Analysis
        </h3>

        {approaches.map((app, index) => (
  <div
    key={index}
    className="mb-3"
  >
    <h4 className="font-bold">
      {app.title}
    </h4>

    <p>
      Time: {app.timeComplexity}
    </p>

    <p>
      Space: {app.spaceComplexity}
    </p>
  </div>
))}

      </div>

      {/* Companies */}
      <h2 className="text-xl font-bold mb-2">
        Companies
      </h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {problem.companies?.map((c, i) => (
          <span
            key={i}
            className="bg-cyan-700 px-2 py-1 rounded"
          >
            {c}
          </span>
        ))}
      </div>

    </div>



      {/* RIGHT */}
      <div className="w-1/2 flex flex-col">

        <div className="p-3 border-b border-slate-800 flex justify-between">

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 px-3 py-2"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div className="flex gap-2">

            <button onClick={runCode} className="bg-green-600 px-3 py-1">
              Run
            </button>

            <button onClick={handleSubmit} className="bg-cyan-600 px-3 py-1">
              Submit
            </button>

          </div>
        </div>

        <Editor
  height="70%"
  language={language}
  theme="vs-dark"
  value={code}
  onChange={(v) => setCode(v)}
/>

<div className="p-3 bg-black overflow-auto">

  <pre>{output}</pre>

  {submissionId && !interviewSession && (
    <button
      onClick={startInterview}
      className="bg-purple-600 px-4 py-2 rounded mt-4"
    >
      Start Interview
    </button>
  )}

  {interviewSession && (
    <div className="mt-4 bg-slate-900 p-4 rounded">

      <h2 className="text-xl font-bold mb-3">
        AI Interview
      </h2>

      <p className="mb-3">
        {
          interviewSession.questions[
            currentQuestion
          ].question
        }
      </p>
      <textarea
  value={answer}
  onChange={(e) =>
    setAnswer(e.target.value)
  }
  className="w-full bg-slate-800 p-2 rounded"
  rows={4}
/>

<button
  onClick={submitAnswer}
  className="bg-cyan-600 px-4 py-2 mt-3 rounded"
>
  Submit Answer
</button>


    </div>
  )}

</div>

      </div>
    </div>
  );
}

export default ProblemDetails;