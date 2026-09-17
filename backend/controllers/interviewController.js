import Submission from "../models/Submission.js";
import InterviewSession from "../models/InterviewSession.js";
import groq from "../config/groq.js";
import Problem from "../models/Problem.js";
export const getInterviewReadiness = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    });

    if (submissions.length === 0) {
      return res.json({
        success: true,
        score: 0,
        strengths: [],
        weaknesses: [],
        solved: 0,
        wrong: 0,
      });
    }

    let solved = 0;
    let wrong = 0;

    const topicMap = {};

    submissions.forEach((sub) => {
      if (sub.status === "Accepted") {
        solved++;
      } else {
        wrong++;
      }

      if (!sub.topic) return;

      if (!topicMap[sub.topic]) {
        topicMap[sub.topic] = {
          total: 0,
          accepted: 0,
        };
      }

      topicMap[sub.topic].total++;

      if (sub.status === "Accepted") {
        topicMap[sub.topic].accepted++;
      }
    });

    const analysis = Object.entries(topicMap).map(
      ([topic, data]) => ({
        topic,
        accuracy: Math.round(
          (data.accepted / data.total) * 100
        ),
      })
    );

    const strengths = [...analysis]
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3)
      .map((t) => t.topic);

    const weaknesses = [...analysis]
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map((t) => t.topic);

    const score = Math.min(
      100,
      Math.round((solved / submissions.length) * 100)
    );

    res.json({
      success: true,
      score,
      strengths,
      weaknesses,
      solved,
      wrong,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Interview readiness failed",
    });
  }
};

export const startInterview = async (req, res) => {
  try {
    const { submissionId, problemId } = req.body;

    const problem = await Problem.findById(problemId);

const prompt = `
You are a FAANG interviewer.

Problem:
${problem.title}

Topic:
${problem.topic}

Difficulty:
${problem.difficulty}

Generate FIVE interview questions.

Rules:
- Do NOT ask coding questions.
- Focus on DSA concepts.
- Start easy then become harder.
- Return only the questions.
`;
const completion =
await groq.chat.completions.create({

  model: "openai/gpt-oss-20b",

    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    });
const aiText = completion.choices[0].message.content;
const questions = aiText
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => ({
    question: line.replace(/^\d+[\).\-\s]*/, "").trim(),
    answer: "",
    feedback: "",
    score: 0,
  }));
    const session = await InterviewSession.create({
      user: req.user._id,
      submission: submissionId,
      problem: problemId,
      questions,
    });

    res.status(201).json({
      success: true,
      session,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

export const answerQuestion = async (req, res) => {
  try {
    const {
      sessionId,
      questionIndex,
      answer,
    } = req.body;

    const session =
      await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    session.questions[questionIndex].answer = answer;

const prompt = `
You are a senior FAANG interviewer conducting a DSA interview.

Problem:
${problem.title}

Topic:
${problem.topic}

Difficulty:
${problem.difficulty}

Generate exactly FIVE interview questions.

The questions MUST progressively increase in difficulty.

Question difficulty structure:

Question 1:
Test basic understanding of the main concept used in the problem.

Question 2:
Test whether the candidate understands how the approach works.

Question 3:
Test application of the concept to a different situation or edge case.

Question 4:
Test time complexity, space complexity, optimization, or trade-offs.

Question 5:
Ask a deeper interview-level question that tests strong conceptual understanding.

Rules:
- Do NOT ask the candidate to write code.
- Do NOT ask the candidate to solve the original problem again.
- Focus on DSA concepts and reasoning.
- Questions must be directly related to the given problem/topic.
- Do not repeat the same concept in multiple questions.
- Questions should be suitable for a technical interview.
- Return exactly FIVE questions.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code fences.

Return exactly this format:

{
  "questions": [
    {
      "question": "Question 1"
    },
    {
      "question": "Question 2"
    },
    {
      "question": "Question 3"
    },
    {
      "question": "Question 4"
    },
    {
      "question": "Question 5"
    }
  ]
}
`;
const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const aiText =
  completion.choices[0].message.content.trim();

let aiResult;

try {
  aiResult = JSON.parse(aiText);
} catch (error) {
  console.log("AI returned invalid JSON:", aiText);

  return res.status(500).json({
    success: false,
    message: "AI returned an invalid evaluation",
  });
}

const feedback =
  aiResult.feedback || "No feedback provided.";

const score = Math.min(
  10,
  Math.max(
    0,
    Number(aiResult.score) || 0
  )
);

session.questions[questionIndex].feedback =
  feedback;

session.questions[questionIndex].score =
  score;

await session.save();
const total = session.questions.reduce(
  (sum, q) => sum + (q.score || 0),
  0
);

session.totalScore = Math.round(
  total / session.questions.length
);
const answered = session.questions.filter(
  (q) => q.answer && q.answer.trim() !== ""
);

if (answered.length === session.questions.length) {
  session.status = "completed";
}
await session.save();

    res.json({
      success: true,
      session,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to save answer",
    });
  }
};

export const getInterviewSession = async (
  req,
  res
) => {
  try {
    const session =
      await InterviewSession.findById(
        req.params.id
      )
        .populate("problem")
        .populate("submission");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    res.json({
      success: true,
      session,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview session",
    });
  }
};