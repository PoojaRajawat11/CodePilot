import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const uploadResume = async (req, res) => {
  try {
    console.log("✅ Resume upload route reached");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    console.log("Resume:", req.file.originalname);
    console.log("File type:", req.file.mimetype);

    let resumeText = "";

    // ==========================================
    // PDF
    // ==========================================
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);

      resumeText = pdfData.text;
    }

    // ==========================================
    // DOCX
    // ==========================================
    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      resumeText = result.value;
    }

    // ==========================================
    // UNSUPPORTED FILE
    // ==========================================
    else {
      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX resumes are supported",
      });
    }

    // ==========================================
    // CLEAN TEXT
    // ==========================================
    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    console.log(
      "📄 Extracted resume text length:",
      resumeText.length
    );

    console.log(
      "📄 Resume preview:",
      resumeText.substring(0, 300)
    );

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this resume. The PDF may contain scanned images.",
      });
    }

    // ==========================================
    // SEND TEXT TO FRONTEND
    // ==========================================
    return res.json({
      success: true,
      message: "Resume uploaded and extracted successfully",
      fileName: req.file.originalname,
      resumeText,
    });

  } catch (error) {
    console.error("❌ Resume upload/extraction error:", error);

    return res.status(500).json({
      success: false,
      message: "Resume processing failed",
      error: error.message,
    });
  }
};