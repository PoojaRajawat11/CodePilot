import groq from "../config/groq.js";
import Submission from "../models/Submission.js";

// ===============================
// 🚀 AI ROADMAP GENERATOR
// ===============================
export const getAIRoadmap = async (req, res) => {
  try {
    const { company = "General DSA" } = req.body;

  const submissions = await Submission.find({
  userId: req.user._id,
});

    if (submissions.length === 0) {
      return res.json({
        success: true,
        company,
        weakTopics: [],
        roadmap:
          "Solve some problems first so AI can generate a personalized roadmap.",
      });
    }

    const topicMap = {};

    submissions.forEach((sub) => {
      if (!sub.topic) return;

      if (!topicMap[sub.topic]) {
        topicMap[sub.topic] = {
          total: 0,
          wrong: 0,
        };
      }

      topicMap[sub.topic].total++;

      if (sub.status !== "Accepted") {
        topicMap[sub.topic].wrong++;
      }
    });

    const weakTopics = Object.entries(topicMap)
      .map(([topic, data]) => {
        const accuracy =
          ((data.total - data.wrong) / data.total) * 100;

        return {
          topic,
          weakScore: Math.round(100 - accuracy),
        };
      })
      .sort((a, b) => b.weakScore - a.weakScore)
      .slice(0, 5);

    const prompt = `
You are a senior FAANG DSA mentor.

Target Company:
${company}

User Weak Topics:
${JSON.stringify(weakTopics, null, 2)}

Create a personalized 7-day interview preparation roadmap.

Requirements:

1. Focus on interview patterns commonly asked by ${company}
2. Prioritize weak topics first
3. Include daily goals
4. Include concepts to learn
5. Include 2-3 practice problems per day
6. Mention difficulty (Easy/Medium/Hard)
7. Mention estimated study time

At the end provide:

- Revision Strategy
- Common Interview Mistakes
- Interview Readiness Advice
- Final Motivation

Format everything clearly using headings and bullet points.
`;
    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const roadmap = completion.choices[0].message.content;

    return res.json({
      success: true,
      company,
      weakTopics,
      roadmap,
    });

  } catch (error) {
    console.log("AI ROADMAP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI Roadmap generation failed",
    });
  }
};