const mongoose = require("mongoose");
require("dotenv").config();

const URL = process.env.DATABASE_URL;

async function mongo() {
  if (!URL) {
    console.warn('DATABASE_URL not set; skipping DB connection for ExamReport');
    return;
  }
  try {
    await mongoose.connect(URL);
    console.log('Connected to DB (ExamReport)');
  } catch (e) {
    console.warn('DB connect failed (ExamReport):', e.message);
  }
}

mongo();

// Sub-schema for each module
const moduleExamSchema = new mongoose.Schema(
  {
    module: { type: Number, required: true },
    exam: {
      examBody: String,
      examName: String,
      examDate: Date,
      score: String,
    },
  },
  { _id: false }
);

const examReportSchema = new mongoose.Schema(
  {
    admissionNo: { type: Number, required: true, index: true },
    studentName: String,
    Level: {
      lvl: { type: Number, default: 3 },
      modules: [moduleExamSchema], // ← Array of modules
    },
    createdAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model("ExamReports", examReportSchema);