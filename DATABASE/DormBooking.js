const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if (!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for DormBooking');
        return;
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (DormBooking)')
    } catch (e) {
        console.warn('DB connect failed (DormBooking):', e.message)
    }
}

mongo()

const dormBookingSchema = new mongoose.Schema(
    {
        admissionNo: Number,
        studentName: String,
        dormBlock: String,
        roomType: String,
        moveInDate: Date,
        moveOutDate: Date,
        createdAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["Pending", "Approved", "Denied"], default: "Pending"}
    }
)

module.exports = mongoose.model("DormBookings", dormBookingSchema)
