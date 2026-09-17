import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Interview() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [answer, setAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  // ==============================
  // Fetch Interview
  // ==============================

  async function fetchInterview() {
    try {
      const { data } = await api.get(
        `/api/interview/session/${id}`
      );

      setSession(data.session);

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // Submit Answer
  // ==============================

  async function submitAnswer() {
    if (!answer.trim()) {
      alert("Please write your answer first.");
      return;
    }

    try {
      setSubmitting(true);

      const { data } = await api.post(
        "/api/interview/answer",
        {
          sessionId: id,
          questionIndex,
          answer,
        }
      );

      const currentQuestion =
        data.session.questions[questionIndex];

      // Save feedback
      setFeedback(currentQuestion.feedback);

      // Save score
      setScore(currentQuestion.score);

      // Update session
      setSession(data.session);

    } catch (err) {
      console.log(err);
      alert("Failed to submit answer.");

    } finally {
      setSubmitting(false);
    }
  }

  // ==============================
  // Next Question
  // ==============================

  function nextQuestion() {
    if (
      questionIndex <
      session.questions.length - 1
    ) {
      setQuestionIndex((prev) => prev + 1);

      setFeedback("");
      setScore(null);
      setAnswer("");

    } else {
      setCompleted(true);
    }
  }

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-xl">
          Loading Interview...
        </h1>
      </div>
    );
  }

  // ==============================
  // Interview Not Found
  // ==============================

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-xl text-red-400">
          Interview not found
        </h1>
      </div>
    );
  }

  // ==============================
  // Completed
  // ==============================

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">

        <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">

          <div className="text-5xl mb-4">
            🎉
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Interview Completed
          </h1>

          <p className="text-slate-400 mb-8">
            You completed all the interview questions.
          </p>

          <div className="bg-slate-800 rounded-xl p-6">

            <p className="text-slate-400 mb-2">
              Final Score
            </p>

            <p className="text-5xl font-bold text-cyan-400">
              {session.totalScore || 0}
              <span className="text-2xl text-slate-400">
                /10
              </span>
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==============================
  // Current Question
  // ==============================

  const currentQuestion =
    session.questions[questionIndex];

  const totalQuestions =
    session.questions.length;

  const progress =
    ((questionIndex + 1) /
      totalQuestions) *
    100;

  // ==============================
  // Main UI
  // ==============================

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              AI Interview
            </h1>

            <p className="text-slate-400 mt-1">
              {session.problem.title}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-400">
              Question
            </p>

            <p className="text-xl font-bold">

              {questionIndex + 1}

              <span className="text-slate-500">
                {" "}/ {totalQuestions}
              </span>

            </p>

          </div>

        </div>

        {/* Progress */}

        <div className="mb-8">

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="text-xs text-slate-500 mt-2">
            {Math.round(progress)}% completed
          </p>

        </div>

        {/* Question Card */}

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
              Q
            </div>

            <div>

              <p className="text-sm text-slate-400">
                Interview Question
              </p>

              <p className="font-semibold">
                Question {questionIndex + 1}
              </p>

            </div>

          </div>

          <p className="text-lg leading-8">
            {currentQuestion?.question}
          </p>

        </div>

        {/* Answer */}

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-3">
            Your Answer
          </h2>

          <p className="text-sm text-slate-400 mb-4">
            Explain your approach clearly.
            The AI interviewer will evaluate your answer.
          </p>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            rows={10}
            disabled={
              submitting || feedback !== ""
            }
            placeholder="Write your answer here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-cyan-500 resize-none"
          />

          {!feedback && (
            <button
              onClick={submitAnswer}
              disabled={submitting}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-xl font-semibold"
            >
              {submitting
                ? "Evaluating Answer..."
                : "Submit Answer"}
            </button>
          )}

        </div>

        {/* AI Feedback */}

        {feedback && (
          <div className="bg-slate-900 border border-cyan-900 rounded-2xl p-6 mb-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold text-cyan-400">
                🤖 AI Feedback
              </h2>

              <div className="bg-slate-800 px-4 py-2 rounded-lg">

                <span className="text-slate-400">
                  Score:
                </span>

                <span className="ml-2 font-bold text-green-400">
                  {score}/10
                </span>

              </div>

            </div>

            <div className="bg-slate-800 rounded-xl p-5">

              <p className="text-slate-200 leading-7 whitespace-pre-wrap">
                {feedback}
              </p>

            </div>

            <button
              onClick={nextQuestion}
              className="mt-5 w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold"
            >
              {questionIndex <
              totalQuestions - 1
                ? "Next Question →"
                : "Finish Interview"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}