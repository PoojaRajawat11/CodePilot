import Problem from "../models/Problem.js";

export const generateDailyPlan = async (
  weakTopics
) => {
  const tasks = [];

  for (const topic of weakTopics) {

    const problems = await Problem.find({
      topic,
      isPublished: true,
    })
      .limit(3)
      .select("title difficulty topic");

    tasks.push(...problems);
  }

  return tasks;
};