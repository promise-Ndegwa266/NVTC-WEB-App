const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if (!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for DeferRequest')
        return
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (DeferRequest)')
    } catch (e) {
        console.warn('DB connect failed (DeferRequest):', e.message)
    }
}

mongo()

const deferRequestSchema = new mongoose.Schema({
    admissionNo: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    duration: { type: String, required: true },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    details: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Denied"], default: "Pending" },
    adminNote: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("DeferRequests", deferRequestSchema)