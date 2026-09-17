import Company from "../models/Company.js";
import Progress from "../models/Progress.js";

export const getCompanyReadiness = async (req, res) => {
  try {
    const { companyName } = req.params;

    // Find company
    const company = await Company.findOne({
      name: companyName,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Find user progress
    const progress = await Progress.findOne({
      userId: req.user.id,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "User progress not found",
      });
    }

    // User topics
    const userTopics = Object.keys(
      progress.topicStats || {}
    );

    // Matched topics
    const matchedTopics = company.requiredTopics.filter(
      (topic) => userTopics.includes(topic)
    );

    // Missing topics
    const missingTopics = company.requiredTopics.filter(
      (topic) => !userTopics.includes(topic)
    );

    // Readiness %
    const readiness = Math.round(
      (matchedTopics.length /
        company.requiredTopics.length) *
        100
    );

    // Readiness level
    let level = "Beginner";

    if (readiness >= 80) {
      level = "Interview Ready";
    } else if (readiness >= 50) {
      level = "Almost Ready";
    }

    res.status(200).json({
      success: true,
      company: company.name,
      difficulty: company.difficulty,
      readiness,
      level,
      matchedTopics,
      missingTopics,
      requiredTopics: company.requiredTopics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};