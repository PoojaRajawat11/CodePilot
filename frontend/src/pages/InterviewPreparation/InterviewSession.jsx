import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function InterviewSession() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const difficulty =
    searchParams.get("difficulty") || "Medium";

  const questionCount = Number(
    searchParams.get("questionCount") || 5
  );

  // ==========================================
  // RESUME DATA
  // ==========================================
  const [resumeText, setResumeText] = useState("");

  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  const startedRef = useRef(false);

  // ==========================================
  // LOAD INTERVIEW SETUP
  // ==========================================
  useEffect(() => {
    const savedSetup =
      sessionStorage.getItem("interviewSetup");

    if (savedSetup) {
      try {
        const setup = JSON.parse(savedSetup);

        console.log("Interview setup:", setup);

        setResumeText(setup.resumeText || "");
      } catch (error) {
        console.error(
          "Could not read interview setup:",
          error
        );
      }
    }
  }, []);

  // ==========================================
  // SEND MESSAGE TO GROQ INTERVIEWER
  // ==========================================
const sendToInterviewer = async (conversation, resumeOverride = resumeText) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/ai/conversational-interview",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            type,
            difficulty,
            questionCount,

            // Resume information
            resumeText: resumeOverride,

            // Company can be added later
            company: "General",

            // Previous conversation
            messages: conversation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Interview request failed"
        );
      }

      return data.reply;
    } catch (error) {
      console.error(
        "Interview error:",
        error
      );

      return "Sorry, I could not connect to the AI interviewer. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // START INTERVIEW
  // ==========================================
  useEffect(() => {
    if (startedRef.current) return;

    // Wait until resume information has been
    // loaded from sessionStorage.
    const savedSetup =
      sessionStorage.getItem("interviewSetup");

    let savedResumeText = "";

    if (savedSetup) {
      try {
        const setup = JSON.parse(savedSetup);
        savedResumeText = setup.resumeText || "";
        setResumeText(savedResumeText);
      } catch (error) {
        console.error(
          "Setup parsing error:",
          error
        );
      }
    }

    startedRef.current = true;

    const startInterview = async () => {
      const firstMessage =
  await sendToInterviewer(
    [
      {
        role: "user",
        content:
          "Start the interview. Greet me briefly and ask your first interview question.",
      },
    ],
    savedResumeText
  );

      setMessages([
        {
          role: "assistant",
          content: firstMessage,
        },
      ]);

      setStarted(true);
    };

    startInterview();
  }, []);

  // ==========================================
  // SUBMIT LEARNER ANSWER
  // ==========================================
  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: answer.trim(),
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setAnswer("");

    const aiReply =
      await sendToInterviewer(
        updatedMessages
      );

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: aiReply,
      },
    ]);

    if (questionNumber < questionCount) {
      setQuestionNumber(
        (prev) => prev + 1
      );
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.ctrlKey
    ) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-cyan-400">
            AI Interview
          </h1>

          <p className="text-gray-400 mt-2">
            {type} Interview
          </p>

          <div className="flex gap-4 mt-3 text-sm">

            <span className="bg-slate-800 px-3 py-1 rounded-lg">
              Difficulty: {difficulty}
            </span>

            <span className="bg-slate-800 px-3 py-1 rounded-lg">
              Question {questionNumber} /{" "}
              {questionCount}
            </span>

            {resumeText && (
              <span className="bg-green-900 text-green-300 px-3 py-1 rounded-lg">
                Resume Based
              </span>
            )}

          </div>
        </div>

        {/* INTERVIEW CHAT */}
        <div className="bg-slate-900 rounded-xl p-6">

          <div className="space-y-6 max-h-[500px] overflow-y-auto mb-6">

            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.role === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-gray-200"
                    }`}
                  >

                    <p className="text-xs mb-2 opacity-60">
                      {message.role === "user"
                        ? "You"
                        : "AI Interviewer"}
                    </p>

                    <p className="whitespace-pre-wrap">
                      {message.content}
                    </p>

                  </div>

                </div>
              )
            )}

            {loading && (
              <div className="bg-slate-800 rounded-xl p-4 max-w-[80%]">
                <p className="text-gray-400">
                  AI Interviewer is thinking...
                </p>
              </div>
            )}

          </div>

          {/* ANSWER */}
          <div>

            <p className="text-gray-400 mb-2">
              Your Answer
            </p>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={
                loading || !started
              }
              className="w-full h-40 bg-slate-800 border border-slate-700 rounded-lg p-4 text-white outline-none focus:border-cyan-400 disabled:opacity-50"
              placeholder={
                started
                  ? "Type your answer here..."
                  : "Starting interview..."
              }
            />

            <p className="text-xs text-gray-500 mt-2">
              Press Ctrl + Enter to submit
            </p>

          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-6">

            <button
              onClick={() =>
                navigate(
                  "/interview-preparation"
                )
              }
              className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
            >
              Exit Interview
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !answer.trim() ||
                !started
              }
              className="px-6 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "AI Thinking..."
                : "Submit Answer"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default InterviewSession;