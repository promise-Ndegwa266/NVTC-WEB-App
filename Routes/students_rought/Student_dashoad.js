const express = require("express")
const app = express.Router()
const Students = require("../../DATABASE/Students")
const CandidateData = require("../../DATABASE/Candidates")
const MassageData = require("../../DATABASE/Message")
const ExamReportData = require("../../DATABASE/ExamReport")
const DormBookingData = require("../../DATABASE/DormBooking")
const DeferRequestData = require("../../DATABASE/Differs")
const Memo = require("../../DATABASE/Memo")

const userdata=[]
let count = 1

async function loadDashboardData() {
    const message = await MassageData.find()
    const candidates = await CandidateData.find()
    const PresidentCandidates = await CandidateData.find({ position: "President" })
    const SportCandidates = await CandidateData.find({ position: "Sports" })
    const EnvironmentCandidates = await CandidateData.find({ position: "Environment" })
    const student = await Students.find()
    const _memo = await Memo.find()
    const examStats = {
        cbet: await Students.countDocuments({ exambody: "CBET" }),
        nita: await Students.countDocuments({ exambody: "NITA" }),
        total: await Students.countDocuments()
    }

    return {
        message,
        candidates,
        PresidentCandidates,
        SportCandidates,
        EnvironmentCandidates,
        student,
        examStats,
        _memo,
        examStudentsCBET: await Students.find({ exambody: "CBET" }),
        examStudentsNITA: await Students.find({ exambody: "NITA" })
    }
}

function addUser(admission) {
    if (!userdata.includes(admission)) {
        userdata.push(admission)
    }
}


app.get("/login",(req,res)=>{
    const massage = req.query.massage
    res.render("form",{errormessage:massage})
})

////////////////////////////////////////
app.post("/data",async (req,res)=>{
    const username_ = req.body.username
    const admision_ = req.body.password
    
    const studentData = await Students.find({adimmisionNumber:admision_})
    if(studentData.length === 0){
        const errorm = "Invalid admission number"
        return res.redirect(`/student-dashboad/login?massage=${errorm}`)
    }
    const studentId = studentData[0].adimmisionNumber

    if(studentId === Number(admision_)){
        return res.redirect(`/authorizetion/two_factor_authontification?username=${encodeURIComponent(username_)}&admision=${encodeURIComponent(admision_)}`)
    }
    return res.redirect(`/student-dashboad/login?massage=Invalid admission number`)
})


app.get("/session-check/:id/:name",async (req,res)=>{
    const admission = req.params.id
    const name = req.params.name
    await addUser(admission)
    const session = userdata.includes(admission)
    session ? res.redirect(`/student-dashboad/voter-dashboad?username=${encodeURIComponent(name)}&admision=${encodeURIComponent(admission)}`) : res.redirect("/student-dashboad/login")
})


app.post("/votes/:id/:name",async (req,res)=>{
    const admission = req.params.id
    const name = req.params.name
    
    const presidentVote = req.body.president
    const sportsVote = req.body.sports
    const environmentVote = req.body.environment
    
    const presidentialVotevalue = await CandidateData.find({_id:presidentVote})
    const sportsVotevalue = await CandidateData.find({_id:sportsVote})
    const environmentVotevalue = await CandidateData.find({_id:environmentVote})

    const candidates = [
        presidentialVotevalue[0],
        sportsVotevalue[0],
        environmentVotevalue[0]
    ].filter(Boolean)

    for (const element of candidates) {
        const currentVotes = Number(element.votes ?? 0)
        const uservote = currentVotes + count
        await CandidateData.updateOne({_id: element._id}, { $set: { votes: uservote } })
    }

    const voted = true
    
    res.redirect(`/student-dashboad/voter-dashboad?username=${encodeURIComponent(name)}&admision=${encodeURIComponent(admission)}&vote=${voted}`)
})


app.post("/book-dorm/:id/:name", async (req, res) => {
    const admission = req.params.id
    const name = req.params.name
    const dormBlock = req.body.dormBlock
    const roomType = req.body.roomType
    const moveInDate = req.body.moveInDate
    const moveOutDate = req.body.moveOutDate

    if (!userdata.includes(admission)) {
        return res.redirect("/student-dashboad/login")
    }

    try {
        await DormBookingData.insertOne({
            admissionNo: admission,
            studentName: name,
            dormBlock: dormBlock || "",
            roomType: roomType || "",
            moveInDate: moveInDate ? new Date(moveInDate) : null,
            moveOutDate: moveOutDate ? new Date(moveOutDate) : null,
            createdAt: new Date()
        })
        res.redirect(`/student-dashboad/voter-dashboad?username=${encodeURIComponent(name)}&admision=${encodeURIComponent(admission)}&dormBooked=true`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})


app.get("/logout/:id",(req,res)=>{
    const admision = req.params.id
    const session = userdata.includes(admision)
    if (session) {
        const idx = userdata.indexOf(admision)
        if (idx !== -1) userdata.splice(idx, 1)
    }
    res.redirect("/")
})


app.get("/voter-dashboad",async (req,res)=>{
    const user = req.query.username
    const admision = req.query.admision
    const voted = req.query.vote
    const dormBooked = req.query.dormBooked
    const deferSuccess = req.query.deferSuccess
    
    const time = new Date().toLocaleTimeString()
    const date = new Date().toDateString()

    const session = userdata.includes(admision)
    const presidentialdata = await CandidateData.find({position:"President"})
    const sportdata = await CandidateData.find({position:"Sports"})
    const environment = await CandidateData.find({position:"Environment"})

    const memos = await Memo.find({$or:[{recipients:"Students"},{recipients:"Both"}]})

    const admissionSearch = [admision]
    const admissionNumeric = Number(admision)
    if (!Number.isNaN(admissionNumeric)) admissionSearch.push(admissionNumeric)

    const examReports = await ExamReportData.find({ admissionNo: { $in: admissionSearch } }).sort({ examDate: -1 })
    const dormBookings = await DormBookingData.find({ admissionNo: { $in: admissionSearch } }).sort({ createdAt: -1 })
    
    session ? res.render("voterdashboad",
        {
            sportposition:sportdata,
            presidentposition:presidentialdata,
            environmentposition:environment,
            username:user, 
            adition:admision, 
            time:time, 
            date:date,
            vote:voted,
            memo:memos,
            dormBooked:dormBooked,
            deferSuccess: deferSuccess,
            examReports: examReports,
            dormBookings: dormBookings,
            deferRequests: deferRequests 
        }) : res.redirect("/student-dashboad/login")
})


// ============================================================
// DEFER REQUEST — Student submits a defer request
// ============================================================
app.post("/defer/:id/:name", async (req, res) => {
    const admission = req.params.id
    const name = decodeURIComponent(req.params.name)

    const duration = req.body.duration
    const reason = req.body.reason
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const details = req.body.details || ""

    if (!userdata.includes(admission)) {
        return res.redirect("/student-dashboad/login")
    }

    try {
        await DeferRequestData.create({
            admissionNo: admission,
            studentName: name,
            duration: duration,
            reason: reason,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            details: details,
            status: "Pending",
            createdAt: new Date()
        })

        res.redirect(
            `/student-dashboad/voter-dashboad?username=${encodeURIComponent(name)}&admision=${encodeURIComponent(admission)}&deferSuccess=true`
        )
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})


module.exports = app