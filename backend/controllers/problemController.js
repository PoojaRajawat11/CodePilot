import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("title difficulty topic slug")
      .sort({ title: 1 });

    res.json(problems);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.json(problem);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};