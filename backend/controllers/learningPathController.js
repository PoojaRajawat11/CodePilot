import Submission from "../models/Submission.js";
import groq from "../config/groq.js";

// ===============================
// 🚀 ADVANCED LEARNING ENGINE
// ===============================
export const getLearningPath = async (req, res) => {
  try {

    const submissions = await Submission.find({
  userId: req.user._id,
});

    if (submissions.length === 0) {
      return res.json({
        success: true,
        weakTopics: [],
        strongTopics: [],
        roadmap: [],
        aiInsights:
          "Start solving problems to generate AI learning insights.",
        interviewReadinessScore: 0,
      });
    }

    const topicStats = {};

    // ===============================
    // ANALYZE PERFORMANCE
    // ===============================
    submissions.forEach((sub) => {
      if (!sub.topic) return;

      if (!topicStats[sub.topic]) {
        topicStats[sub.topic] = {
          total: 0,
          wrong: 0,
          solved: 0,
        };
      }

      topicStats[sub.topic].total++;

      if (sub.status === "Accepted") {
        topicStats[sub.topic].solved++;
      } else {
        topicStats[sub.topic].wrong++;
      }
    });

    const analysis = Object.entries(topicStats).map(
      ([topic, data]) => {
        const accuracy =
          data.total > 0
            ? (data.solved / data.total) * 100
            : 0;

        return {
          topic,
          accuracy: Math.round(accuracy),
          weakness: Math.round(100 - accuracy),
        };
      }
    );

    // ===============================
    // WEAK TOPICS
    // ===============================
    const weakTopics = [...analysis]
      .sort((a, b) => b.weakness - a.weakness)
      .slice(0, 5);

    // ===============================
    // STRONG TOPICS
    // ===============================
    const strongTopics = [...analysis]
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);

    // ===============================
    // STREAK (TEMPORARY)
    // ===============================
    const userStreak = 5;

    // ===============================
    // DIFFICULTY SCALING
    // ===============================
    const scaleDifficulty = (weakness) => {

      if (userStreak >= 10) return "Hard";

      if (weakness > 70) return "Easy";

      if (weakness > 40) return "Medium";

      return "Hard";
    };

    const roadmapBase = weakTopics.map(
      (topic, index) => ({
        day: index + 1,
        topic: topic.topic,
        weakness: topic.weakness,
        difficulty: scaleDifficulty(
          topic.weakness
        ),
      })
    );

    // ===============================
    // INTERVIEW SCORE
    // ===============================
    const totalSolved =
      submissions.filter(
        (s) => s.status === "Accepted"
      ).length;

    const acceptanceRate =
      submissions.length > 0
        ? (totalSolved / submissions.length) * 100
        : 0;

    const interviewReadinessScore =
      Math.round(
        acceptanceRate * 0.7 +
        (
          100 -
          (weakTopics[0]?.weakness || 0)
        ) * 0.3
      );

    // ===============================
    // AI ANALYSIS
    // ===============================
    const prompt = `
You are a FAANG DSA mentor.

Weak Topics:
${JSON.stringify(weakTopics, null, 2)}

Strong Topics:
${JSON.stringify(strongTopics, null, 2)}

Roadmap:
${JSON.stringify(roadmapBase, null, 2)}

User Streak:
${userStreak}

Interview Readiness:
${interviewReadinessScore}

Generate:

1. Why these topics are weak
2. Mistake patterns
3. Personalized learning strategy
4. Motivation
5. Interview preparation advice

Keep response structured.
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

const aiInsights =
  completion.choices[0].message.content;

    // ===============================
    // RESPONSE
    // ===============================
    res.json({
      success: true,

      weakTopics,
      strongTopics,

      roadmap: roadmapBase,

      aiInsights,

      userStreak,

      interviewReadinessScore,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI Learning Path Failed",
    });
  }
};