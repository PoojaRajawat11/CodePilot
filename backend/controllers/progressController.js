import Progress from "../models/Progress.js";

/**

* CHECK SAME DAY
  */
  const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;

return (
d1.getDate() === d2.getDate() &&
d1.getMonth() === d2.getMonth() &&
d1.getFullYear() === d2.getFullYear()
);
};

/**

* GET USER PROGRESS
  */
  export const getProgress = async (req, res) => {
  try {
  let progress = await Progress.findOne({
  userId: req.user.id,
  });

  if (!progress) {
  progress = await Progress.create({
  userId: req.user.id,
  });
  }

  res.json(progress);
  } catch (err) {
  res.status(500).json({
  message: err.message,
  });
  }
  };

/**

* UPDATE PROGRESS
  */
  export const updateProgress = async (req, res) => {
  try {
  const {
  problemTitle,
  topic,
  type,
  } = req.body;

  let progress = await Progress.findOne({
  userId: req.user.id,
  });

  if (!progress) {
  progress = await Progress.create({
  userId: req.user.id,
  });
  }

  // =========================
  // STREAK SYSTEM
  // =========================

  const today = new Date();

  if (!progress.lastActiveDate) {
  progress.currentStreak = 1;
  } else {
  const lastDate = new Date(
  progress.lastActiveDate
  );

  const diffTime =
  today - lastDate;

  const diffDays = Math.floor(
  diffTime /
  (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
  progress.currentStreak += 1;
  } else if (diffDays > 1) {
  progress.currentStreak = 1;
  }
  }

  progress.lastActiveDate = today;

  // =========================
  // ATTEMPTS
  // =========================

  progress.attempts += 1;

  // =========================
  // SOLVED PROBLEMS
  // =========================

  if (type === "solved") {
  progress.passed += 1;

  if (
  !progress.solvedProblems.includes(
  problemTitle
  )
  ) {
  progress.solvedProblems.push(
  problemTitle
  );
  }
  }

  // =========================
  // TOPIC STATS
  // =========================

  if (topic) {
  if (!progress.topicStats[topic]) {
  progress.topicStats[topic] = {
  attempted: 0,
  passed: 0,
  };
  }

  progress.topicStats[
  topic
  ].attempted += 1;

  if (type === "solved") {
  progress.topicStats[
  topic
  ].passed += 1;
  }

  // Required because topicStats
  // is stored as Object
  progress.markModified(
  "topicStats"
  );
  }

  // =========================
  // ACTIVITY LOG
  // =========================

  progress.activities.push({
  type,
  problem: problemTitle,
  topic,
  date: new Date(),
  });

  await progress.save();

  res.json(progress);
  } catch (err) {
  res.status(500).json({
  message: err.message,
  });
  }
  };
