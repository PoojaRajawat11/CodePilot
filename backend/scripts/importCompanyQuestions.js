import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import CompanyQuestion from "../models/CompanyQuestion.js";

dotenv.config();

const DATASET_PATH = path.join(
  process.cwd(),
  "company-data"
);

async function readCSV(filePath, company, timePeriod) {
  return new Promise((resolve, reject) => {
    const questions = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        questions.push({
          company,

          title: row.Title?.trim() || "",

          difficulty:
            row.Difficulty?.trim().toLowerCase() === "easy"
              ? "Easy"
              : row.Difficulty?.trim().toLowerCase() === "hard"
              ? "Hard"
              : "Medium",

          frequency:
            Number(row.Frequency) || 0,

          acceptanceRate:
            Number(row["Acceptance Rate"]) || 0,

          topics: row.Topics
            ? row.Topics
                .split(",")
                .map((topic) => topic.trim())
                .filter(Boolean)
            : [],

          sourceLink: row.Link?.trim() || "",

          timePeriod,
        });
      })
      .on("end", () => resolve(questions))
      .on("error", reject);
  });
}

async function importQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove previous imported company questions
    await CompanyQuestion.deleteMany({});

    console.log("Old company questions removed");

    const companies = fs
      .readdirSync(DATASET_PATH, {
        withFileTypes: true,
      })
      .filter((item) => item.isDirectory());

    let totalImported = 0;

    for (const companyDir of companies) {
      const company = companyDir.name;

      const companyPath = path.join(
        DATASET_PATH,
        company
      );

      const files = fs
        .readdirSync(companyPath)
        .filter((file) => file.endsWith(".csv"));

      for (const file of files) {
        const filePath = path.join(
          companyPath,
          file
        );

        const timePeriod = file
          .replace(".csv", "")
          .replace(/^\d+\.\s*/, "");

        console.log(
          `Importing ${company} → ${timePeriod}`
        );

        const questions = await readCSV(
          filePath,
          company,
          timePeriod
        );

        if (questions.length > 0) {
          await CompanyQuestion.insertMany(
            questions
          );

          totalImported += questions.length;
        }
      }
    }

    console.log(
      `\n✅ Imported ${totalImported} company questions`
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Import failed:",
      error
    );

    await mongoose.disconnect();

    process.exit(1);
  }
}

importQuestions();