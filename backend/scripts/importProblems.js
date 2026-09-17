import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Problem from "../models/Problem.js";

dotenv.config();

// Connect MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB Connected");

// Read JSON
const data = JSON.parse(
  fs.readFileSync("./data/leetcode.json", "utf8")
);

console.log("JSON Loaded");
console.log("Keys:", Object.keys(data));
console.log("Total Questions:", data.questions.length);

try {
  // Delete old problems
  await Problem.deleteMany({});
  console.log("🗑️ Old problems deleted");

  // Convert JSON to your schema
  const formattedProblems = data.questions
  .filter(item => item.description && item.title)
  .map((item) => ({
    // Required fields
    title: item.title || "",
    slug: item.problem_slug || "",
    difficulty: item.difficulty || "Easy",
    topic: item.topics?.join(", ") || "General",
    description: (() => {
  const desc = item.description || "";

  const cleaned = desc
    .replace(/Example 1:[\s\S]*/i, "")
    .trim();

  return cleaned || "No description available.";
})(),

    // Optional fields
    topics: item.topics || [],

   examples:
  item.examples?.map((ex) => {

    const text = ex.example_text || "";

    const inputMatch = text.match(/Input:(.*?)Output:/s);

    const outputMatch = text.match(/Output:(.*?)(Explanation:|$)/s);

    const explanationMatch = text.match(/Explanation:(.*)/s);

    return {

      example_num: ex.example_num,

      input: inputMatch
        ? inputMatch[1].trim()
        : "",

      output: outputMatch
        ? outputMatch[1].trim()
        : "",

      explanation: explanationMatch
        ? explanationMatch[1].trim()
        : "",

      images: ex.images || [],

    };

  }) || [],

    constraints: item.constraints || [],
    companies: item.companies || [],

    acceptanceRate: item.acceptance_rate || 0,
    totalSubmissions: item.total_submissions || 0,
    successfulSubmissions: item.successful_submissions || 0,

    premium: item.premium || false,
    isPublished: true,

    statement: "",

    bruteForce: "",
    optimal: "",

    complexity: {
      brute: "",
      optimal: "",
    },

    approaches: [],

    pattern: "",

    interviewTips: [],

    mistakes: [],

    starterCode: {
  javascript: item.code_snippets?.javascript || "",
  python: item.code_snippets?.python3 || item.code_snippets?.python || "",
  java: item.code_snippets?.java || "",
  cpp: item.code_snippets?.cpp || "",
},

visibleTests:
item.examples?.map((ex)=>{

const text=ex.example_text || "";

const inputMatch=text.match(/Input:(.*?)Output:/s);

const outputMatch=text.match(/Output:(.*?)(Explanation:|$)/s);

return{

input:inputMatch
?inputMatch[1].trim()
:"",

output:outputMatch
?outputMatch[1].trim()
:""

};

}) || [],
hiddenTests: [],
  }));

  console.log("Formatted:", formattedProblems.length);

  await Problem.insertMany(formattedProblems);

  console.log(
    `✅ Successfully Imported ${formattedProblems.length} Problems`
  );
} catch (err) {
  console.error("❌ Import Error:");
  console.error(err);
} finally {
  await mongoose.connection.close();
  console.log("🔌 MongoDB Connection Closed");
}