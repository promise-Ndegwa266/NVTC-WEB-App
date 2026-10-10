const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if (!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for Memo');
        return;
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (Memo)')
    } catch (e) {
        console.warn('DB connect failed (Memo):', e.message)
    }
}

mongo()

const memoSchema = new mongoose.Schema(
    {
        subject: { type: String, required: true },
        message: { type: String, required: true },
        senderName: { type: String, required: true },
        senderRole: { type: String, default: "Admin" },
        recipients: {
            type: String,
            enum: ["All", "Admins", "Students", "Both"],
            default: "Both"
        },
        priority: {
            type: String,
            enum: ["Normal", "Important", "Urgent"],
            default: "Normal"
        },
        createdAt: { type: Date, default: Date.now },
        readBy: { type: [String], default: [] }
    }
)

module.exports = mongoose.model("memos", memoSchema)