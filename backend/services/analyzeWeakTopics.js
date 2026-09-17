export const analyzeWeakTopics = (progress) => {
  const stats = progress.topicStats || {};

  const weakTopics = [];

  Object.keys(stats).forEach((topic) => {
    const data = stats[topic];

    const accuracy =
      data.attempts > 0
        ? (data.solved / data.attempts) * 100
        : 0;

    if (accuracy < 60) {
      weakTopics.push(topic);
    }
  });

  return weakTopics;
};