import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Save submission to backend
export const submitSolution = async ({
  problemId,
  language,
  code,
  status,
  runtime = "",
  memory = "",
  output = "",
}) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
  `${API_URL}/ai/save-submission`,
    {
      problemId,
      language,
      code,
      status,
      runtime,
      memory,
      output,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Get all submissions of current user
export const getUserSubmissions = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_URL}/ai/submissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Get submission history of one problem
export const getProblemSubmissions = async (problemId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_URL}/ai/submissions/${problemId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};