import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InterviewSetup() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      return;
    }

    setResume(file);
    setResumeUploaded(false);
  };

  const uploadResume = async () => {
    if (!resume) {
      alert("Please select your resume first.");
      return null;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("resume", resume);

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Resume upload failed"
        );
      }

      console.log("Resume uploaded:", data);

      setResumeUploaded(true);

      return data;
    } catch (error) {
      console.error("Resume upload error:", error);
      alert(error.message || "Resume upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const startInterview = async () => {
    console.log({
      type,
      difficulty,
      questionCount,
    });

    // Upload resume if selected
    let resumeData = null;

    if (resume) {
      resumeData = await uploadResume();

      if (!resumeData) {
        return;
      }
    }

    /*
      Save interview setup temporarily.
      InterviewSession.jsx will read this.
    */
    sessionStorage.setItem(
      "interviewSetup",
      JSON.stringify({
        type,
        difficulty,
        questionCount,

        resumeText:
          resumeData?.resumeText ||
          resumeData?.text ||
          "",

        resumeName: resume?.name || "",
      })
    );

    navigate(
      `/interview-preparation/session/${type}?difficulty=${difficulty}&questionCount=${questionCount}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-400 mb-3">
          Interview Setup
        </h1>

        <p className="text-slate-400 mb-10">
          Configure your AI interview before starting.
        </p>

        {/* Interview Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">
            Interview Type
          </h2>

          <p className="text-cyan-400 capitalize">
            {type}
          </p>
        </div>

        {/* Difficulty */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            Difficulty
          </h2>

          <div className="flex gap-3">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-5 py-2 rounded-lg ${
                  difficulty === level
                    ? "bg-cyan-600"
                    : "bg-slate-800"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            Number of Questions
          </h2>

          <select
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(Number(e.target.value))
            }
            className="bg-slate-800 px-4 py-3 rounded-lg"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        {/* RESUME */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">
            Resume
          </h2>

          <p className="text-slate-400 text-sm mb-4">
            Upload your resume so the AI interviewer can
            ask questions based on your experience and skills.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            className="block w-full text-sm text-slate-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-cyan-600 file:text-white
              hover:file:bg-cyan-500"
          />

          {resume && (
            <div className="mt-4 bg-slate-800 rounded-lg p-3">
              <p className="text-green-400">
                ✓ {resume.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Resume selected
              </p>
            </div>
          )}

          {resumeUploaded && (
            <p className="text-green-400 mt-3">
              ✓ Resume uploaded successfully
            </p>
          )}
        </div>

        {/* START */}
        <button
          onClick={startInterview}
          disabled={uploading}
          className="w-full bg-green-600 hover:bg-green-700
            disabled:bg-slate-700 disabled:cursor-not-allowed
            py-4 rounded-xl text-lg font-bold"
        >
          {uploading
            ? "Uploading Resume..."
            : "Start AI Interview"}
        </button>

      </div>
    </div>
  );
}