import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "../temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

export const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;
    

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: "Language and code are required",
      });
    }

    const id = uuid();

    let fileName = "";
    let command = "";

    switch (language) {
      case "javascript":
        fileName = `${id}.js`;
        break;

      case "python":
        fileName = `${id}.py`;
        break;

      case "cpp":
        fileName = `${id}.cpp`;
        break;
        case "java":
    fileName = "Main.java";
    break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported language",
        });
    }

    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, code);

    if (language === "javascript") {
      command = `node "${filePath}"`;
    }

    if (language === "python") {
      command = `python "${filePath}"`;
    }

    if (language === "cpp") {
      const exePath = path.join(tempDir, `${id}.exe`);

      command = `g++ "${filePath}" -o "${exePath}" && "${exePath}"`;
    }
if (language === "java") {
  command = `javac "${filePath}" && java -cp "${tempDir}" Main`;
}
console.log("Language:", language);
console.log("Command:", command);

if (!command) {
  return res.status(400).json({
    success: false,
    message: `Unsupported language: ${language}`,
  });
}
    exec(command, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (language === "cpp") {
        const exe = path.join(tempDir, `${id}.exe`);

        if (fs.existsSync(exe)) {
          fs.unlinkSync(exe);
        }
        
      }
      

      if (error) {
  console.log("Error:", error);
  console.log("stderr:", stderr);
  console.log("stdout:", stdout);

  return res.json({
    stdout: "",
    stderr: stderr || error.message,
  });
}

      return res.json({
        stdout,
        stderr: "",
      });
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      stdout: "",
      stderr: "Execution Failed",
    });
  }
};