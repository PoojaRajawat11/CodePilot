import axios from "axios";

const API_URL = "http://localhost:5000/api/compiler";

export async function runCode(sourceCode, language) {
  try {
    const res = await axios.post(`${API_URL}/run`, {
      language,
      code: sourceCode,
    });

    return {
      stdout: res.data.stdout || "",
      stderr: res.data.stderr || "",
      compile_output: "",
      time: "",
      memory: "",
    };
  } catch (err) {
    console.error(err);

    return {
      stdout: "",
      stderr: "Execution Failed",
      compile_output: "",
      time: "",
      memory: "",
    };
  }
}