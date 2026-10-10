const mongodb = require("mongoose")
require("dotenv").config()

const URL = process.env.DATABASE_URL

async function mongo() {
    if(!URL) {
        console.warn('DATABASE_URL not set; skipping DB connection for Students');
        return;
    }
    try {
        await mongodb.connect(URL)
        console.log('Connected to DB (Students)')
    } catch (e) {
        console.warn('DB connect failed (Students):', e.message)
    }
}

mongo()

const StudentData = new mongodb.Schema(
    {
        name:{
            firstName:String,
            secondName:String
        },
        gender:String,
        Yearofstudy:String,
        adimmisionNumber:Number,
        cource:String,
        exambody:String,
        intake:Date,
        email:String
    }
)

module.exports = mongodb.model("Students", StudentData)