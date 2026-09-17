import React, { useState } from "react";
import api from "../../services/api";
function ProblemInfo({ problem }) {
  const [showMentor, setShowMentor] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Mentor. Tell me where you're stuck. I won't give you the solution directly."
    }
  ]);
  const [input, setInput] = useState("");
    const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = {
    role: "user",
    content: input,
  };

  // Show user's message immediately
  setMessages((prev) => [...prev, userMessage]);

  const currentInput = input;
  setInput("");

  try {
    const { data } = await api.post("/api/mentor/chat", {
      problemId: problem._id,
      message: currentInput,
      language: "java", // We'll make this dynamic later
      code: "",
      history: [...messages, userMessage],
    });

    const mentorReply = {
      role: "assistant",
      content: data.reply,
    };

    setMessages((prev) => [...prev, mentorReply]);

  } catch (err) {
    console.log(err);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, AI Mentor is unavailable right now.",
      },
    ]);
  }
};
  if (!problem) {
    return (
      <div className="p-6 text-white">
        Loading Problem...
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold text-red-500 mb-3">
  TEST - {problem.title}
</h1>
      {/* Difficulty + Topic */}
      <div className="flex flex-wrap gap-3 mb-4">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold
          ${
            problem.difficulty === "Easy"
              ? "bg-green-600"
              : problem.difficulty === "Medium"
              ? "bg-yellow-500"
              : "bg-red-600"
          }`}
        >
          {problem.difficulty}
        </span>

        {problem.topic && (
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
            {problem.topic}
          </span>
        )}

      </div>

      {/* Companies */}
      {problem.companies?.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Companies
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {problem.companies.map((company, index) => (
              <span
                key={index}
                className="bg-purple-700 px-3 py-1 rounded-full text-xs"
              >
                {company}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Description */}
      <h2 className="text-xl font-bold mb-3">
        Description
      </h2>

      <p className="text-gray-300 whitespace-pre-wrap leading-7">
        {problem.description}
      </p>
      <div className="mt-6">
  <button
    onClick={() => setShowMentor(!showMentor)}
    className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg font-semibold transition"
  >
    🤖 Ask AI Mentor
  </button>
</div>
{showMentor && (
  <div className="mt-4 bg-slate-800 border border-cyan-500 rounded-lg p-4">

  <h3 className="text-lg font-bold text-cyan-400 mb-4">
    🤖 AI Mentor
  </h3>

  <div className="h-64 overflow-y-auto bg-slate-900 rounded p-3 space-y-3">

    {messages.map((msg, index) => (

      <div
        key={index}
        className={`p-3 rounded-lg max-w-[85%]
          ${
            msg.role === "assistant"
              ? "bg-cyan-700"
              : "bg-gray-700 ml-auto"
          }`}
      >
        <strong>
          {msg.role === "assistant" ? "AI" : "You"}
        </strong>

        <p className="mt-1">
          {msg.content}
        </p>

      </div>

    ))}

  </div>

  <div className="flex gap-2 mt-4">

    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask where you're stuck..."
      className="flex-1 bg-slate-900 rounded px-3 py-2 outline-none"
    />

    <button
      onClick={handleSend}
      className="bg-cyan-600 hover:bg-cyan-700 px-5 rounded"
    >
      Send
    </button>

  </div>

</div>
)}

      {/* Examples */}
{problem.examples?.length > 0 && (
  <>
    <h2 className="text-xl font-bold mt-8 mb-4">
      Examples
    </h2>

    {problem.examples
      .filter(Boolean)
      .map((example, index) => (
        <div
          key={index}
          className="mb-6 rounded-lg bg-slate-800 p-4"
        >
          <h3 className="font-bold text-cyan-400 mb-3">
            Example {example.example_num || index + 1}
          </h3>

          <div className="mb-3">
            <p className="font-semibold">Input</p>
            <pre className="whitespace-pre-wrap text-gray-300 bg-slate-900 p-3 rounded">
              {example.input || "N/A"}
            </pre>
          </div>

          <div className="mb-3">
            <p className="font-semibold">Output</p>
            <pre className="whitespace-pre-wrap text-gray-300 bg-slate-900 p-3 rounded">
              {example.output || "N/A"}
            </pre>
          </div>

          {example.explanation && (
            <div>
              <p className="font-semibold">Explanation</p>
              <pre className="whitespace-pre-wrap text-gray-300 bg-slate-900 p-3 rounded">
                {example.explanation}
              </pre>
            </div>
          )}
        </div>
      ))}
  </>
)}
      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-4">
            Constraints
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>
                {constraint}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Follow Ups */}
      {problem.follow_ups?.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-4">
            Follow Up
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {problem.follow_ups.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Hints */}
      {problem.hints?.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-4">
            Hints
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {problem.hints.map((hint, index) => (
              <li key={index}>
                {hint}
              </li>
            ))}
          </ul>
        </>
      )}

    </div>
  );
}

export default ProblemInfo;