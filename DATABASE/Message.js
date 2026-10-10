const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo(){
    if(!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for Message');
        return;
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (Message)')
    } catch (e) {
        console.warn('DB connect failed (Message):', e.message)
    }
}

mongo()

const massageShema = mongoose.Schema(
    {
        name:String,
        email:String,
        phoneNumber:Number,
        date:Date,
        message:String
    }
)

module.exports = mongoose.model("Messages",massageShema)