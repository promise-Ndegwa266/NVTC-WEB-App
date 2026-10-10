const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if (!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for Admin');
        return;
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (Admin)')
    } catch (e) {
        console.warn('DB connect failed (Admin):', e.message)
    }
}

mongo()

const adminShema = mongoose.Schema(
    {
        name:{
            firstName:String,
            secondName:String
        },
        email:String,
        userName:String,
        prevlage:String,
        password:String,
        backupPassword:String
    }
)

module.exports = mongoose.model("admins",adminShema)