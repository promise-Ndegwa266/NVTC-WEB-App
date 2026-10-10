const mongoose = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if(!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for Candidates');
        return;
    }
    try {
        await mongoose.connect(URL)
        console.log('Connected to DB (Candidates)')
    } catch (e) {
        console.warn('DB connect failed (Candidates):', e.message)
    }
}

mongo()

const userShcema = new mongoose.Schema(
    {
        name:{
            presidentName:String,
            runingMateName:String
        },
        position:String,
        admition:{
            presidentAdmition:Number,
            runingMateAdmition:Number
        },
        votes:Number
    }
)
module.exports = mongoose.model('Candidates', userShcema)

