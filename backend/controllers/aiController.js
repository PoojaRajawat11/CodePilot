import groq from "../config/groq.js";
import Submission from "../models/Submission.js";
import Streak from "../models/Streak.js";
import Problem from "../models/Problem.js";
import InterviewSession from "../models/InterviewSession.js";

// ======================================================
// 🚀 SOLUTION GENERATOR
// ======================================================
export const generateSolution = async (req, res) => {
  try {
    const { problem, language } = req.body;

    const prompt = `
You are a DSA expert.

Problem:
${problem}

Language:
${language}

Give:
1. Brute Force
2. Optimal Solution
3. Time & Space Complexity
`;

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
});

res.json({
  success: true,
  data: completion.choices[0].message.content,
});
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ======================================================
// 🔍 FAILURE ANALYSIS
// ======================================================
export const analyzeFailure = async (req, res) => {
  try {
    const { code, expected, got, language, problem } = req.body;

    const prompt = `
You are a DSA mentor.

Problem: ${problem}
Language: ${language}

Code:
${code}

Expected: ${expected}
Got: ${got}

Explain mistake and fix.
`;

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
});

res.json({
  success: true,
  feedback: completion.choices[0].message.content,
});
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ======================================================
// 🧠 SMART HINT (PERSONALIZED)
// ======================================================
export const generateHint = async (req, res) => {
  try {
    const { problem, code, language, level } = req.body;
    const userId = req.user._id;

    const submissions = await Submission.find({ userId });

    const topicMap = {};
    let wrongCount = 0;

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, wrong: 0 };
      }

      topicMap[topic].total++;

      if (s.status !== "Accepted") {
        topicMap[topic].wrong++;
        wrongCount++;
      }
    });

    let weakestTopic = "Arrays";
    let maxWeak = 0;

    Object.entries(topicMap).forEach(([topic, data]) => {
      const weak = data.wrong / data.total;

      if (weak > maxWeak) {
        maxWeak = weak;
        weakestTopic = topic;
      }
    });

    const prompt = `
You are a DSA mentor.

Weak Topic: ${weakestTopic}
Mistakes: ${wrongCount}

Problem: ${problem}
Code: ${code}
Level: ${level}

Give ONLY hint (no solution).
`;

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
});

    res.json({
      success: true,
      hint: completion.choices[0].message.content,
      weakestTopic,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ======================================================
// 🎤 MOCK INTERVIEW
// ======================================================
export const mockInterview = async (req, res) => {
  try {
    const { problem, code, language, status } = req.body;

    const prompt = `
You are a FAANG interviewer.

Problem: ${problem}
Code: ${code}
Language: ${language}
Status: ${status}

Give:
- Score /10
- Strengths
- Weaknesses
- Improvements
`;

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
});

    res.json({
      success: true,
      interview: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
// ======================================================
// 🤖 CONVERSATIONAL AI INTERVIEW
// ======================================================
export const conversationalInterview = async (req, res) => {
  try {
    const {
      type,
      difficulty,
      company,
      messages = [],
      questionNumber = 1,
      questionCount = 5,
    } = req.body;

    const interviewType = type || "technical";
    const level = difficulty || "Medium";
    const selectedCompany = company || "General";

    const systemPrompt = `
You are CodePilot AI Interviewer.

You are conducting a REAL human-like interview.

Do NOT behave like a question generator.
Behave like an attentive professional interviewer.

Interview Type: ${interviewType}
Difficulty: ${level}
Company: ${selectedCompany}

Current question: ${questionNumber}
Maximum questions: ${questionCount}

========================
CORE BEHAVIOR
========================

1. Ask ONLY ONE question at a time.

2. Carefully read the candidate's previous answer.

3. Your next response MUST be influenced by the candidate's answer.

4. Do NOT blindly move to an unrelated question.

5. If the candidate gives an interesting answer, ask a natural follow-up.

6. If the candidate's answer is incomplete, unclear, or weak:
   ask a clarification or follow-up question.

7. If the candidate gives a strong answer:
   gradually increase the difficulty.

8. If the candidate struggles:
   simplify the next question.

9. Do not immediately reveal the correct answer.

10. Do not give long explanations during the interview.

11. Do not ask multiple questions in one response.

12. Do not repeat a question that has already been asked.

13. Keep the interview conversational and natural.

14. Occasionally acknowledge the candidate's answer briefly before
    asking the next question.

15. Never reveal your internal evaluation or score during the interview.

========================
INTERVIEW TYPES
========================

HR:
Ask behavioral and situational questions.

Examples of areas:
- Introduction
- Strengths and weaknesses
- Teamwork
- Conflict
- Leadership
- Failure
- Career goals
- Workplace situations

TECHNICAL:
Ask programming and software-development questions.

Possible areas:
- Programming
- OOP
- APIs
- Databases
- Backend
- Frontend
- Software engineering

DSA:
Ask algorithm and data-structure questions.

Focus on:
- Approach
- Data structures
- Complexity
- Optimization
- Edge cases

Do NOT immediately provide the solution.

CS CORE:
Ask questions from:
- DBMS
- Operating Systems
- Computer Networks
- OOP
- Computer Architecture
- Other core CS subjects

VERBAL:
Focus on:
- Communication
- Explanation
- Clarity
- Confidence
- Structured speaking

MIXED:
Naturally combine:
- HR
- Technical
- DSA
- CS Core

========================
DIFFICULTY
========================

Easy:
Fundamental concepts and simple situations.

Medium:
Conceptual understanding and practical application.

Hard:
Deep reasoning, real-world scenarios and challenging follow-ups.

========================
CONVERSATION RULE
========================

The conversation history is extremely important.

Read ALL previous messages before responding.

If the candidate said something in their answer,
use that information in your next question.

Example:

Candidate:
"I built a DSA platform using React and Node.js."

Good interviewer:
"You mentioned using Node.js for the backend.
How did you structure the API layer in your project?"

Bad interviewer:
"What is polymorphism?"

The good interviewer connects the question to the candidate's answer.

========================
FIRST QUESTION
========================

If there is no candidate answer yet,
start the interview naturally.

Do NOT start with:
"Question 1:"

Instead say something natural such as:

"Hi! Let's begin. Could you tell me a little about yourself?"

Adapt this to the interview type.

========================
RESPONSE FORMAT
========================

Return ONLY what the interviewer should say to the candidate.

Do not return:
- JSON
- analysis
- score
- internal reasoning
- labels
- "AI:"
- "Interviewer:"

Keep the response concise and conversational.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({
      success: true,
      reply,
    });

  } catch (err) {
    console.error("Interview AI error:", err);

    res.status(500).json({
      success: false,
      message: "AI interview failed",
      error: err.message,
    });
  }
  
};
// ======================================================
// 📊 WEAK TOPICS
// ======================================================
export const getWeakTopics = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    });

    const map = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!map[topic]) {
        map[topic] = { total: 0, wrong: 0 };
      }

      map[topic].total++;

      if (s.status !== "Accepted") {
        map[topic].wrong++;
      }
    });

    const data = Object.entries(map).map(([topic, d]) => {
      const acc =
        ((d.total - d.wrong) / d.total) * 100;

      return {
        topic,
        accuracy: Math.round(acc),
        weakScore: Math.round(100 - acc),
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
// ======================================================
// 📅 DAILY PROBLEMS
// ======================================================
export const getDailyProblems = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    });

    // -----------------------------
    // 1. BUILD TOPIC STATS
    // -----------------------------
    const topicMap = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!topicMap[topic]) {
        topicMap[topic] = { total: 0, wrong: 0 };
      }

      topicMap[topic].total++;

      if (s.status !== "Accepted") {
        topicMap[topic].wrong++;
      }
    });

    // -----------------------------
    // 2. FIND WEAK TOPICS
    // -----------------------------
    const weakTopics = Object.entries(topicMap)
      .map(([topic, data]) => {
        const accuracy =
          data.total > 0
            ? (data.total - data.wrong) / data.total
            : 0;

        return {
          topic,
          weakness: 1 - accuracy,
        };
      })
      .sort((a, b) => b.weakness - a.weakness)
      .slice(0, 3);

    // -----------------------------
    // 3. BUILD AI PROMPT
    // -----------------------------
    const prompt = `
You are a DSA expert AI coach.

User weak topics:
${weakTopics.map(t => `- ${t.topic}`).join("\n")}

Generate 3 DAILY PRACTICE PROBLEMS:

Rules:
- 1 Easy
- 1 Medium
- 1 Hard
- Must be based on weak topics
- Include title + topic + difficulty + short reason

Format clearly.
`;

    
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    const response = completion.choices[0].message.content   ;

    // -----------------------------
    // 5. RESPONSE
    // -----------------------------
    res.json({
      success: true,
      weakTopics,
      dailyPlan: response,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "AI daily problems failed",
    });
  }
};

// ======================================================
// 🧠 LEARNING PATH
// ======================================================
export const getLearningPath = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    });

    const map = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!map[topic]) {
        map[topic] = { total: 0, wrong: 0 };
      }

      map[topic].total++;

      if (s.status !== "Accepted") {
        map[topic].wrong++;
      }
    });

    const roadmap = Object.entries(map)
      .map(([topic, d]) => {
        const acc =
          ((d.total - d.wrong) / d.total) * 100;

        return {
          topic,
          weakScore: 100 - acc,
        };
      })
      .sort((a, b) => b.weakScore - a.weakScore)
      .map((t, i) => ({
        step: i + 1,
        topic: t.topic,
        focus: t.weakScore > 50 ? "Practice" : "Revise",
      }));

    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ======================================================
// 🧠 PERSONAL COACH MODE
// ======================================================
export const getPersonalCoach = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    });

    const map = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!map[topic]) {
        map[topic] = { total: 0, solved: 0 };
      }

      map[topic].total++;

      if (s.status === "Accepted") {
        map[topic].solved++;
      }
    });

    const weakTopics = Object.entries(map)
      .map(([topic, d]) => {
        const acc =
          (d.solved / d.total) * 100 || 0;

        return {
          topic,
          accuracy: Math.round(acc),
          weakScore: Math.round(100 - acc),
        };
      })
      .sort((a, b) => b.weakScore - a.weakScore);

    const dailyProblems = weakTopics
      .slice(0, 3)
      .map((t, i) => ({
        day: i + 1,
        topic: t.topic,
        focus: "Practice",
      }));

    res.json({
      success: true,
      coach: {
        weakTopics,
        dailyProblems,
      },
    });
  } catch (err) {
  console.log(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
}
};

// ======================================================
// 💾 SAVE SUBMISSION
// ======================================================
export const saveSubmission = async (req, res) => {
  try {
    const submission =
await Submission.create({

  userId: req.user._id,

  problemId: req.body.problemId,

  language: req.body.language,

  code: req.body.code,

  status: req.body.status,

  topic: req.body.topic,

  xp: req.body.xp || 0,

});
const prompt = `
You are a senior FAANG DSA reviewer.

Programming Language:
${submission.language}

Topic:
${submission.topic}

Submission Status:
${submission.status}

Code:
${submission.code}

Analyze the code.

Return ONLY valid JSON.

{
  "feedback":"...",
  "strengths":["...","..."],
  "mistakes":["...","..."]
}
`;

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

let analysis;

try {
  analysis = JSON.parse(
    completion.choices[0].message.content
  );
} catch {
  analysis = {
    feedback: "Good attempt.",
    strengths: [],
    mistakes: [],
  };
}

submission.aiFeedback = analysis.feedback;
submission.strengths = analysis.strengths;
submission.mistakes = analysis.mistakes;

await submission.save();
let interviewSession = null;
const userId = req.user._id;
if (submission.status === "Accepted") {

  const problem = await Problem.findById(submission.problemId);

  const prompt = `
You are a FAANG interviewer.

Problem:
${problem.title}

Topic:
${problem.topic}

Difficulty:
${problem.difficulty}

Generate exactly 5 interview questions.

Rules:
- Do NOT ask coding questions.
- Ask conceptual DSA questions.
- Start easy.
- Increase difficulty gradually.
- Return ONLY a JSON array.

Example:

[
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5"
]
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let questions = [];

  try {
    questions = JSON.parse(
      completion.choices[0].message.content
    );
  } catch {
    questions = [
      "Explain your approach.",
      "What is the time complexity?",
      "What is the space complexity?",
      "Can this solution be optimized?",
      "Which edge cases should be handled?"
    ];
  }

  interviewSession = await InterviewSession.create({
  user: req.user._id,
  submission: submission._id,
  problem: submission.problemId,
  questions: questions.map((q) => ({
    question: q,
  })),
});

}

    if (userId && submission.status === "Accepted") {
  let streak = await Streak.findOne({ userId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!streak) {
    streak = await Streak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastSolvedDate: today,
      xp: 10,
    });
  } else {
    const lastDate = new Date(streak.lastSolvedDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today - lastDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak.currentStreak += 1;
    } else if (diffDays > 1) {
      streak.currentStreak = 1;
    }

    streak.lastSolvedDate = today;

    // XP SYSTEM 🔥
    streak.xp += submission.xp;
    streak.level =
  Math.floor(streak.xp / 100) + 1;

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
// ⭐ BADGES

if (
  streak.currentStreak >= 7 &&
  !streak.badges.includes("7 Day Streak")
) {
  streak.badges.push("7 Day Streak");
}

if (
  streak.currentStreak >= 30 &&
  !streak.badges.includes("30 Day Streak")
) {
  streak.badges.push("30 Day Streak");
}

if (
  streak.level >= 5 &&
  !streak.badges.includes("Level 5")
) {
  streak.badges.push("Level 5");
}

if (
  streak.level >= 10 &&
  !streak.badges.includes("Level 10")
) {
  streak.badges.push("Level 10");
}
  await streak.save();
  }
}

return res.json({
  success: true,
  submission,
  interviewSessionId: interviewSession?._id || null,
});

} catch (err) {
  res.status(500).json({ success: false });
}};

/// ======================================================
// 📥 GET MY SUBMISSIONS
// ======================================================
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load submissions",
    });
  }
};
// ======================================================
// 📈 PROGRESS CHART DATA
// ======================================================
export const getProgressChart = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user._id,
    }).sort({ createdAt: 1 });

    const dailyMap = {};

    submissions.forEach((s) => {
      const date = new Date(s.createdAt)
        .toISOString()
        .split("T")[0];

      if (!dailyMap[date]) {
        dailyMap[date] = {
          total: 0,
          accepted: 0,
        };
      }

      dailyMap[date].total++;

      if (s.status === "Accepted") {
        dailyMap[date].accepted++;
      }
    });

    const chartData = Object.entries(dailyMap).map(
      ([date, data]) => {
        const accuracy =
          data.total === 0
            ? 0
            : (data.accepted / data.total) * 100;

        return {
          date,
          accuracy: Math.round(accuracy),
          submissions: data.total,
          accepted: data.accepted,
        };
      }
    );

    const totalSubmissions = submissions.length;

const accepted = submissions.filter(
  (s) => s.status === "Accepted"
).length;

const accuracy =
  totalSubmissions === 0
    ? 0
    : Math.round(
        (accepted / totalSubmissions) * 100
      );

res.json({
  success: true,
  chartData,
  stats: {
    totalSubmissions,
    accepted,
    accuracy,
  },
});
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Chart generation failed",
    });
  }
};
// ======================================================
// 🎯 RECOMMENDED PROBLEMS
// ======================================================
export const getRecommendations = async (req, res) => {
  try {

    const submissions = await Submission.find({
      userId: req.user._id,
    });

    const topicMap = {};

    submissions.forEach((s) => {
      const topic = s.topic || "Unknown";

      if (!topicMap[topic]) {
        topicMap[topic] = {
          total: 0,
          wrong: 0,
        };
      }

      topicMap[topic].total++;

      if (s.status !== "Accepted") {
        topicMap[topic].wrong++;
      }
    });

    let weakestTopic = null;
    let maxWeakness = -1;

    Object.entries(topicMap).forEach(
      ([topic, data]) => {

        const weakness =
          data.total === 0
            ? 0
            : data.wrong / data.total;

        if (weakness > maxWeakness) {
          maxWeakness = weakness;
          weakestTopic = topic;
        }

      }
    );

    let recommendations = [];

    if (weakestTopic) {
      recommendations = await Problem.find({
        topic: weakestTopic,
      }).limit(5);
    }

    if (recommendations.length === 0) {
      recommendations =
        await Problem.find().limit(5);
    }

    res.json({
      success: true,
      weakestTopic,
      recommendations,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Recommendation failed",
    });

  }
};
// ======================================================
// 👤 PROFILE DASHBOARD
// ======================================================
export const getProfileStats = async (req, res) => {
  try {

    const userId = req.user._id;

    const submissions = await Submission.find({
      userId,
    });

    const streak = await Streak.findOne({
      userId,
    });

    const accepted = submissions.filter(
      (s) => s.status === "Accepted"
    ).length;

    const total = submissions.length;

    const accuracy =
      total > 0
        ? Math.round((accepted / total) * 100)
        : 0;

    const solvedProblems = new Set(
      submissions
        .filter(
          (s) => s.status === "Accepted"
        )
        .map((s) => String(s.problemId))
    );

    const xp = streak?.xp || 0;

    const level =
      Math.floor(xp / 100) + 1;

    res.json({
      success: true,

      profile: {
        level,
        xp,
        currentStreak:
          streak?.currentStreak || 0,
        longestStreak:
          streak?.longestStreak || 0,
        solvedProblems:
          solvedProblems.size,
        accuracy,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
    });

  }
};
// ======================================================
// 🏆 LEADERBOARD
// ======================================================
export const getLeaderboard = async (req, res) => {
  try {

    const leaderboard =
      await Submission.aggregate([

        {
          $match: {
            status: "Accepted",
          },
        },

        {
          $group: {
            _id: "$userId",
            solved: {
              $sum: 1,
            },
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },

        {
          $unwind: "$user",
        },

        {
          $project: {
            solved: 1,
            username: "$user.name",
            email: "$user.email",
          },
        },

        {
          $sort: {
            solved: -1,
          },
        },

        {
          $limit: 20,
        },

      ]);

    res.json({
      success: true,
      leaderboard,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
    });

  }
};
// ======================================================
// 📅 DAILY CHALLENGE
// ======================================================

export const getDailyChallenge = async (req, res) => {
  try {

    const problems = await Problem.find();

    if (!problems.length) {
      return res.status(404).json({
        success: false,
        message: "No problems found",
      });
    }

    const day =
      Math.floor(
        Date.now() / (1000 * 60 * 60 * 24)
      );

    const index = day % problems.length;

    res.json({
      success: true,
      challenge: problems[index],
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Failed to get challenge",
    });

  }
};
// ======================================================
// 📊 DASHBOARD PROGRESS
// ======================================================
export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({
      userId,
    });

    const streak = await Streak.findOne({
      userId,
    });

    const solvedProblems = submissions
      .filter((s) => s.status === "Accepted")
      .map((s) => s.problemTitle);

    const passed = submissions.filter(
      (s) => s.status === "Accepted"
    ).length;

    const attempts = submissions.length;

    res.json({
      solvedProblems,
      currentStreak: streak?.currentStreak || 0,
      rating: 1200,
      passed,
      attempts,
      topicStats: {},
      activities: [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Progress fetch failed",
    });
  }
};