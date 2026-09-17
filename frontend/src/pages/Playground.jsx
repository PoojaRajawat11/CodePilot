import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProblemInfo from "../components/playground/ProblemInfo";
import CodeEditor from "../components/playground/CodeEditor";

import { getProblem } from "../services/problemService";
import { runCode } from "../utils/piston";
import { submitSolution } from "../services/submissionService";

export default function Playground() {

  const { id } = useParams();
const navigate = useNavigate();
  const [problem, setProblem] = useState(null);

  const [loading, setLoading] = useState(true);

  const [running, setRunning] = useState(false);

  const [output, setOutput] = useState("");
const [currentCode, setCurrentCode] = useState("");
const [currentLanguage, setCurrentLanguage] = useState("java");


  useEffect(() => {

    fetchProblem();

  }, [id]);



  async function fetchProblem() {

    try {

      setLoading(true);

      const data = await getProblem(id);

      console.log(data);

      setProblem(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }


// ==============================
// Run Code
// ==============================

async function handleRun(code, language) {

  try {

    setRunning(true);

    setOutput("Running...");

    const result = await runCode(
      code,
      language
    );

    console.log(result);

    if (result.compile_output) {

      setOutput(result.compile_output);

    }

    else if (result.stderr) {

      setOutput(result.stderr);

    }

    else if (result.stdout) {

      setOutput(result.stdout);

    }

    else {

      setOutput("Program executed successfully.");

    }

  }

  catch (err) {

    console.log(err);

    setOutput("Execution Failed.");

  }

  finally {

    setRunning(false);

  }

}



// ==============================
// Submit Code
// ==============================

async function handleSubmit(code, language) {

  try {

    setRunning(true);

    setOutput("Submitting...");



    const result = await runCode(
      code,
      language
    );



    let status = "Accepted";



    if (result.compile_output) {

      status = "Compile Error";

    }

    else if (result.stderr) {

      status = "Runtime Error";

    }



    const response = await submitSolution({

      problemId: problem._id,

      language,

      code,

      status,

      runtime: result.time || "",

      memory: result.memory || "",

      output:

        result.stdout ||

        result.stderr ||

        result.compile_output ||

        ""

    });
console.log("Submit Response:", response);


    if (result.compile_output) {

      setOutput(result.compile_output);

    }

    else if (result.stderr) {

      setOutput(result.stderr);

    }

    else {

      setOutput(result.stdout);

    }



    if (
  status === "Accepted" &&
  response.interviewSessionId
) {
  const start = window.confirm(
    "🎉 Solution Accepted!\n\nAI has prepared a mock interview.\n\nStart Interview now?"
  );

  if (start) {
    navigate(
      `/interview/${response.interviewSessionId}`
    );
  }
} else {
  alert(`Submission Status: ${status}`);
}

  }

  catch (err) {

    console.log(err);

    setOutput("Submission Failed.");

  }

  finally {

    setRunning(false);

  }

}



  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">

        Loading Problem...

      </div>

    );

  }

return (

  <div className="h-screen bg-slate-950 text-white">

    <div className="grid grid-cols-2 h-full">

      {/* LEFT PANEL */}

      <div className="border-r border-slate-800 overflow-y-auto">

       <div className="h-full overflow-y-auto">
  <ProblemInfo
  problem={problem}
  code={currentCode}
  language={currentLanguage}
/>
</div>

      </div>



      {/* RIGHT PANEL */}

      <div className="overflow-hidden">

        <CodeEditor
  problem={problem}
  output={output}
  loading={running}
  onRun={handleRun}
  onSubmit={handleSubmit}
  code={currentCode}
  setCode={setCurrentCode}
  language={currentLanguage}
  setLanguage={setCurrentLanguage}
/>

      </div>

    </div>

  </div>

);

}