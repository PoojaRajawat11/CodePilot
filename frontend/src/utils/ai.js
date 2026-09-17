import axios from "axios";

// 🤖 Interview AI
export const interviewAI = async (data) => {
  return await axios.post(
    "http://localhost:5000/api/ai/interview",
    data
  );
};

// 🎤 Mock Interview AI
export const mockInterview = async (data) => {
  return await axios.post(
    "http://localhost:5000/api/ai/mock-interview",
    data
  );
};