import MentorPlan from "../models/MentorPlan.js";
import Progress from "../models/Progress.js";
import Problem from "../models/Problem.js";
import { analyzeWeakTopics } from "../services/analyzeWeakTopics.js";
import { generateDailyPlan } from "../services/generateDailyPlan.js";
import groq from "../config/groq.js";

/*
=================================
GENERATE TODAY'S PLAN
=================================
*/
export const generateTodayPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    // already generated?
    let existingPlan = await MentorPlan.findOne({
      userId,
      date: today,
    });

    if (existingPlan) {
      return res.json(existingPlan);
    }

    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const weakTopics = analyzeWeakTopics(progress);

    const tasks = await generateDailyPlan(
  weakTopics
);

    const plan = await MentorPlan.create({
      userId,
      date: today,
      weakTopics,
      tasks,
    });

    res.json(plan);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================
GET TODAY'S PLAN
=================================
*/
export const getTodayPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date().toISOString().split("T")[0];

    const plan = await MentorPlan.findOne({
      userId,
      date: today,
    });

    if (!plan) {
      return res.status(404).json({
        message: "No plan generated today",
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================
MARK TASK COMPLETE
=================================
*/
export const markTaskComplete = async (req, res) => {
  try {
    const { planId, taskIndex } = req.body;

    const plan = await MentorPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    if (!plan.tasks[taskIndex]) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    plan.tasks[taskIndex].completed = true;

    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//AI MENTOR CHAT//
export const chatWithMentor = async (req, res) => {
  try {
    const { problemId, message, code, language, history = [] } = req.body;

    if (!problemId || !message) {
      return res.status(400).json({
        message: "problemId and message are required"
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found"
      });
    }

   
const prompt = `
You are CodePilot AI Mentor.

You are helping a student solve a Data Structures and Algorithms problem.

Problem Title:
${problem.title}

Difficulty:
${problem.difficulty}

Topic:
${problem.topic}

Problem Description:
${problem.description}

Programming Language:
${language}

Student Code:
${code || "No code submitted"}

Student Question:
${message}

Instructions:

1. Never reveal the full solution.
2. Never write complete code.
3. Give only one hint at a time.
4. Explain why the student's approach is correct or incorrect.
5. If there is a syntax mistake, explain only that mistake.
6. If there is a logical mistake, guide the student toward fixing it.
7. Ask one follow-up question.
8. Keep the answer under 120 words.
9. Encourage the student.

Reply:
`;

const completion = await groq.chat.completions.create({
 model: "openai/gpt-oss-20b",
  temperature: 0.4,
  max_tokens: 200,
  messages: [
  {
    role: "system",
    content:
      "You are CodePilot AI Mentor. Never provide complete solutions or full code. Give hints one step at a time, explain mistakes, and encourage learning.",
  },

  ...history,

  {
    role: "user",
    content: prompt,
  },
],
});

const reply = completion.choices[0].message.content;

return res.json({
  reply,
});
    

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};
// ==========================================
// GENERAL AI STUDY MENTOR
// ==========================================
export const chatWithStudyMentor = async (req, res) => {
  try {
    console.log("🔥 STUDY CHAT CONTROLLER STARTED");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      message,
      history = [],
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    console.log("📝 STUDENT MESSAGE:", message);
    console.log("🤖 ABOUT TO CALL GROQ");

    const prompt = `
You are CodePilot AI Study Mentor.

You are a personal academic mentor for a Computer Science student.

The student can ask questions about:
- DSA
- Programming
- Java
- C++
- Python
- DBMS
- Operating Systems
- Computer Networks
- OOP
- Software Engineering
- Web Development
- AI/ML
- Interview preparation
- Programming concepts
- Study strategies related to Computer Science

Answer clearly using simple language.

Rules:
1. Understand the student's question.
2. Give a direct and useful explanation.
3. Use examples when helpful.
4. For programming questions, explain the concept before code.
5. If solving a coding problem, guide step-by-step.
6. Do not unnecessarily give complete solutions.
7. Stay primarily focused on academic and career-related questions.
8. Keep the response concise but useful.
9. Encourage the student when appropriate.

Student Question:
${message}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are CodePilot AI Study Mentor. Help students understand Computer Science and academic concepts clearly.",
        },
        ...history,
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("🤖 GROQ RESPONSE RECEIVED");

    const reply = completion?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log("❌ GROQ RETURNED NO RESPONSE");

      return res.status(500).json({
        success: false,
        message: "AI did not return a response",
      });
    }

    console.log("✅ AI REPLY:", reply);

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("❌ STUDY MENTOR ERROR:");
    console.error(error);
    console.error("MESSAGE:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};