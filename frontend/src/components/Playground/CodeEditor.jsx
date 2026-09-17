    import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({
  problem,
  onRun,
  onSubmit,
  output,
  loading,
  code,
  setCode,
  language,
  setLanguage,
})  {


const [codes, setCodes] = useState({
  javascript: "",
  python: "",
  java: "",
  cpp: "",
});

 useEffect(() => {
  if (!problem) return;

  const starterCodes = {
    javascript: problem.starterCode?.javascript || "",
    python: problem.starterCode?.python || "",
    java: problem.starterCode?.java || "",
    cpp: problem.starterCode?.cpp || "",
  };

  setCodes(starterCodes);

  setCode(starterCodes[language] || "");
}, [problem]); 
  return (
    <div className="flex flex-col h-full bg-slate-900">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700">

        <select
          value={language}
          onChange={(e) => {
  setLanguage(e.target.value);

 
}}
          className="bg-slate-800 text-white px-3 py-2 rounded-lg"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <div className="flex gap-3">

          <button
            onClick={() => onRun(codes[language], language)}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
          >
            Run
          </button>

          <button
            onClick={() => onSubmit(codes[language], language)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>

      </div>

      {/* Monaco */}
      <div className="flex-1">

        <Editor
  height="60vh"
  language={language === "cpp" ? "cpp" : language}
  value={codes[language]}
  onChange={(value) => {

  const newCode = value || "";

  setCodes({
    ...codes,
    [language]: newCode,
  });

  setCode(newCode);

}}
/>

      </div>

     {/* Bottom Panel */}
<div className="h-64 border-t border-slate-700 grid grid-cols-2">

  {/* Visible Test Cases */}
  <div className="border-r border-slate-700 p-4 overflow-y-auto bg-slate-900">

    <h2 className="text-lg font-semibold text-cyan-400 mb-3">
      Visible Test Cases
    </h2>

    {problem?.visibleTests?.length > 0 ? (

      problem.visibleTests
        .filter(Boolean)
        .map((test, index) => (

          <div
            key={index}
            className="mb-4 bg-slate-800 rounded-lg p-3"
          >

            <p className="font-semibold">
              Test Case {index + 1}
            </p>

            <p className="mt-2 text-sm text-gray-300">
              <strong>Input:</strong>
            </p>

            <pre className="whitespace-pre-wrap text-green-400">
              {test.input || "N/A"}
            </pre>

            <p className="mt-2 text-sm text-gray-300">
              <strong>Expected:</strong>
            </p>

            <pre className="whitespace-pre-wrap text-yellow-300">
              {test.output || "N/A"}
            </pre>

          </div>

        ))

    ) : (

      <p className="text-gray-400">
        No visible test cases.
      </p>

    )}

  </div>

  {/* Output */}
  <div className="p-4 overflow-y-auto bg-black">

    <h2 className="text-lg font-semibold text-cyan-400 mb-3">
      Output
    </h2>

    <pre className="whitespace-pre-wrap text-green-400">
      {loading
        ? "Executing..."
        : output || "Click Run to execute your code."}
    </pre>

  </div>

</div>

    </div>
  );
}

export default CodeEditor;