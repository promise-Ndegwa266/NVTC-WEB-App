const express = require("express")
const app = express.Router()
const bcrypt = require("bcryptjs")
const Students = require("../../DATABASE/Students")
const CandidateData = require("../../DATABASE/Candidates")
const MassageData = require("../../DATABASE/Message")
const AdminData = require("../../DATABASE/Admin")
const ExamReportData = require("../../DATABASE/ExamReport")
const DormBookingData = require("../../DATABASE/DormBooking")
const EnrollmentData = require("../../DATABASE/EnrollmentForm")
const DeferRequestData = require("../../DATABASE/Differs")
const MemoData = require("../../DATABASE/Memo")
const { adminSession, adminSessionActive, addAdminSession, removeAdminSession } = require("../../adminSessionStore")

async function loadDashboardData() {
    const message = await MassageData.find()
    const candidates = await CandidateData.find()
    const PresidentCandidates = await CandidateData.find({ position: "President" })
    const SportCandidates = await CandidateData.find({ position: "Sports" })
    const EnvironmentCandidates = await CandidateData.find({ position: "Environment" })
    const student = await Students.find()
    const enrollments = await EnrollmentData.find({Enrollment:false})
    const enrolled = await EnrollmentData.find({Enrollment:true})
    const dormBookings = await DormBookingData.find().sort({ createdAt: -1 })
    const deferRequests = await DeferRequestData.find().sort({ createdAt: -1 })
    const memos = await MemoData.find().sort({ createdAt: -1 })
    const examStats = {
        cbet: await Students.countDocuments({ exambody: "CBET" }),
        cbetenrollment: await EnrollmentData.countDocuments({TraineeData:{CourseDetails:{ExamBody:"CBET"}},Enrollment:true}),
        nita: await Students.countDocuments({ exambody: "NITA" }),
        nitaenrollment: await EnrollmentData.countDocuments({TraineeData:{CourseDetails:{ExamBody:"NITA"}},Enrollment:true}),
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
        enrollments,
        enrolled,
        dormBookings,
        deferRequests,
        memos,
        examStudentsCBET: await Students.find({ exambody: "CBET" }),
        examStudentsNITA: await Students.find({ exambody: "NITA" })
    }
}

let addmition_number = 4605


app.get("/admin-login",(req,res)=>{
    const massage = req.query.massege
    res.render("adminlogin",{message:massage})
})



app.get("/admin-data-form",async (req,res)=>{
    const username = req.query.name
    const password = req.query.password

    const admindata = await AdminData.find({userName:username})
    if (!admindata || admindata.length === 0) {
        return res.redirect("/admin-dashboad/admin-login?massege=Admin not found")
    }

    const hash = admindata[0].password
    const same = await bcrypt.compare(password,hash)
    if (!same) return res.redirect("/admin-dashboad/admin-login?massege=Invalid credentials")

    addAdminSession(username)

    return res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
})


app.get("/admin-voter-dashboad", async (req, res) => {
    const username = req.query.name
    const searchParam = req.query.searchResults

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    // ---- Parse searchResults safely ----
    let searchResults
    if (typeof searchParam !== 'undefined' && searchParam !== '') {
        try {
            searchResults = JSON.parse(decodeURIComponent(searchParam))
            if (!Array.isArray(searchResults)) searchResults = []
        } catch (e) {
            searchResults = []
        }
    }
    // If searchParam is undefined → searchResults stays undefined
    // This lets the template distinguish "not searched" from "searched, no results"

    const adminLength = adminSession.length
    const admindata = await AdminData.findOne({ userName: username })
    const hod = await AdminData.find({ prevlage: "H.O.D" })
    const admin = await AdminData.find({ prevlage: "Admin" })
    const dashboardData = await loadDashboardData()
    const date = new Date().toDateString()
    const time = new Date().toLocaleTimeString()

    res.render("dashboad", {
        candite: dashboardData.candidates,
        thelength: dashboardData.candidates.length,
        studentlength: dashboardData.student.length,
        date: date,
        time: time,
        sport: dashboardData.SportCandidates,
        environment: dashboardData.EnvironmentCandidates,
        presidential: dashboardData.PresidentCandidates,
        user: JSON.stringify({ name: username }),
        searchResults: searchResults,   // ← parsed array OR undefined
        name: username,
        activeadmin: adminLength,
        messagedata: dashboardData.message,
        examStats: dashboardData.examStats,
        Admininfo: admindata,
        enrolled: dashboardData.enrolled,
        enrollment: dashboardData.enrollments,
        instuctors: hod,
        dormRequests: dashboardData.dormBookings,
        deferRequests: dashboardData.deferRequests,
        memos: dashboardData.memos,
        Admins: admin
    })
})


app.get("/massage-delete",async (req,res)=>{
    const date = req.query.date
    const id = req.query.id
    const data = req.query.data
    const objct = JSON.parse(data)
    
    await MassageData.deleteOne({_id:id})
    res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${objct.name}`)
    
})


app.post("/message-data",async (req,res)=>{
    const fullname = req.body.fullName
    const email = req.body.emailAddress
    const phone = req.body.phoneNumber
    const massage = req.body.messageText
    const date = new Date().toDateString()

    try{
        await MassageData.insertOne(
            {
                name:fullname,
                email:email,
                phoneNumber:phone,
                date:date,
                message:massage
            }
        )
        res.redirect("/")
    }
    catch(e){
        console.log(e)
        res.send(e.message)
    }
})


app.get("/admin-logout/:user",(req,res)=>{
    const rawUser = req.params.user
    let user = rawUser
    try {
        const parsed = JSON.parse(rawUser)
        if (parsed && parsed.name) user = parsed.name
    } catch (e) {
        // rawUser is not JSON, use it directly
    }
    removeAdminSession(user)
    res.redirect("/")
})


app.post("/student-data",async (req,res)=>{
    const {
        firstname,
        secondname,
        admissionno,
        email,
        gender,
        cource,
        yearofstudy,
        exambody,
        intakedate
    } = req.body
    
    const id = req.body.id 
    
    const admin = JSON.parse(id)

    try{
        const student = await Students.insertOne(
            {
                name:{
                    firstName:firstname,
                    secondName:secondname
                },
                gender:gender,
                Yearofstudy:yearofstudy,
                adimmisionNumber:admissionno,
                cource:cource,
                exambody:exambody,
                intake:intakedate,
                email:String(email)
            }
        )
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${admin.name}`)
    }catch(e){
        console.log(e)
        res.send(e.message)
    }
})


app.get("/view_Enrollment_Form",async (req,res)=>{
    const id = req.query.id
    const data = req.query.data
    const username = JSON.parse(data)

    if (!adminSessionActive(username.name)) return res.redirect("/admin-dashboad/admin-login")
        
    const Student = await EnrollmentData.findOne({_id:id})
    res.render("student_view",{
        studentData:Student,
        user:data
    })
})


app.get("/Enroll_Student",async (req,res)=>{
    const id = req.query.id
    const data = req.query.data
    const username = JSON.parse(data)

    if (!adminSessionActive(username.name)) return res.redirect("/admin-dashboad/admin-login")
        
    const Student = await EnrollmentData.findOne({_id:id})
    const Trainers = await AdminData.find({prevlage:"H.O.D"})
    res.render("Enrollstudent_",{
        studentData:Student,
        addmition:addmition_number,
        Instructors:Trainers,
        user:data
    })
})


app.post("/exam-report", async (req, res) => {
    const admissionNo = req.body.admissionno
    const studentName = req.body.studentname
    const examBody = req.body.examBody
    const examName = req.body.examName
    const examDate = req.body.examDate
    const score = req.body.score
    const lvl = Number(req.body.level)
    const modules = Number(req.body.modules)
    const admin = JSON.parse(req.body.id)

    try {
        await ExamReportData.insertOne({
            score: score || "",
            createdAt: new Date(),
            /////////////////////
            admissionNo: admissionNo,
            studentName: studentName,
            Level: {
                lvl: lvl || 4,
                modules: [
                {
                    module: modules || 1,
                    exam: {
                    examBody: examBody || "",
                    examName: examName || "",
                    examDate: examDate,
                    score: score || "",
                    },
                }
                ],
            }
        })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${admin.name}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})



app.get("/student-search", async (req, res) => {
    const {
        firstname,
        secondname,
        admissionno,
        examBody,
        name
    } = req.query

    if (!adminSessionActive(name)) return res.redirect("/admin-dashboad/admin-login")

    try {
        // Build a query only from fields the user actually filled in
        const query = {}

        if (firstname && firstname.trim()) {
            query["name.firstName"] = { $regex: firstname.trim(), $options: "i" }
        }
        if (secondname && secondname.trim()) {
            query["name.secondName"] = { $regex: secondname.trim(), $options: "i" }
        }
        if (admissionno && admissionno.trim()) {
            query.adimmisionNumber = admissionno.trim()
        }
        if (examBody && examBody.trim()) {
            query.exambody = examBody.trim()
        }

        // No search fields → return empty results
        if (Object.keys(query).length === 0) {
            return res.redirect(
                `/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(name)}&searchResults=${encodeURIComponent(JSON.stringify([]))}`
            )
        }

        const students = await Students.find(query).lean()

        // JSON.stringify → encodeURIComponent → safe for URL
        const encoded = encodeURIComponent(JSON.stringify(students))

        res.redirect(
            `/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(name)}&searchResults=${encoded}`
        )
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})


app.get("/student_anrolled_delete",async (req,res)=>{
    const id = req.query.id
    const data = req.query.data
    const objct = JSON.parse(data)

    const enrollments = await EnrollmentData.findOneAndDelete({_id:id})
    
    res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${objct.name}`)
    
})


app.get("/detete-student/:id/:data",async (req, res) => {
    const studentAdmision = req.params.id
    const adminData = req.params.data
    let objectAdminData = { name: '' }
    try {
        objectAdminData = JSON.parse(adminData)
    } catch (e) {
        console.warn('detete-student: failed to parse data param')
    }

    await Students.findOneAndDelete({adimmisionNumber:studentAdmision})
    await ExamReportData.findOneAndDelete({admissionNo:studentAdmision})
    await DormBookingData.findOneAndDelete({admissionNo:studentAdmision})

    res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(objectAdminData.name || '')}`)

})



app.get("/new-admin/:data",async (req, res)=>{
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(username)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) {
        // use raw data if not JSON
    }

    const adsesion = adminSessionActive(username)
    const adminData = await AdminData.find()

    adsesion ? res.render("newadmin",
        {
            data:data,
            dataAdmin:adminData
        }
    ) : res.redirect("/")
})



app.get("/delede-admin/:id/:data",async (req,res)=>{
    const id = req.params.id
    const data = req.params.data

    const adminData = await AdminData.find({_id:id})
    await AdminData.deleteOne({_id:adminData[0]._id})

    res.redirect(`/admin-dashboad/new-admin/${data}`)
})


app.get("/delite-cadidate/:id/:user",async (req,res)=>{
    const id = req.params.id
    const user = req.params.user
    const data = JSON.parse(user)
    const candidates = await CandidateData.deleteOne({_id:id})
    res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${data.name}`)
})


app.post("/candidates",async (req, res)=>{
   const candidate = req.body.cadidatename
   const candidateadmitio = req.body.cadidateadmision
   const position = req.body.position
   const runingmate = req.body.runingmatename
   const runingmateadmition = req.body.runingmateadmition
   const id = req.body.id 
    
    const admin = JSON.parse(id)

    try{
        const data = await CandidateData.insertOne(
            {
                name:{
                    presidentName:candidate,
                    runingMateName:runingmate
                },
                position:position,
                admition:{
                    presidentAdmition:candidateadmitio,
                    runingMateAdmition:runingmateadmition
                },
                votes:0
            }
        )
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${admin.name}`)
        
    }catch(e){
        console.log(e)
        res.send(e.message)
    }
    
})



app.get("/upload-admin",async(req, res)=>{
    const admin = req.query.admin

    const jsonadmin = JSON.parse(admin)
    const aminpass = jsonadmin.password
    const hash = await bcrypt.hash(aminpass,10)
    //console.log(hash)
    try{
        await AdminData.insertOne(
            {
                name:{
                    firstName:jsonadmin.name.firstName,
                    secondName:jsonadmin.name.secondName
                },
                email:jsonadmin.email,
                prevlage:jsonadmin.previlage,
                userName:jsonadmin.userName,
                password:hash,
                backupPassword:jsonadmin.password
               
            }
        )
        
        res.redirect(`/admin-dashboad/new-admin/${jsonadmin.data}`)

    }
    catch(e){
        res.send(e)
        console.log(e)
    }
})

// ============================================================
// DORM BOOKING ROUTES
// ============================================================

app.get("/approve-dorm/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DormBookingData.updateOne({ _id: id }, { $set: { status: "Approved" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

app.get("/deny-dorm/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DormBookingData.updateOne({ _id: id }, { $set: { status: "Denied" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

app.get("/revoke-dorm/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DormBookingData.updateOne({ _id: id }, { $set: { status: "Pending" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

app.get("/delete-dorm/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DormBookingData.findOneAndDelete({ _id: id })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// ============================================================
// MEMO ROUTES
// ============================================================

// Send a new memo
app.post("/send-memo", async (req, res) => {
    const {
        subject,
        message,
        recipients,
        priority,
        id
    } = req.body

    const admin = JSON.parse(id)

    if (!adminSessionActive(admin.name)) return res.redirect("/admin-dashboad/admin-login")

    try {
        const adminData = await AdminData.findOne({ userName: admin.name })

        await MemoData.insertOne({
            subject: subject,
            message: message,
            senderName: admin.name,
            senderRole: adminData ? adminData.prevlage : "Admin",
            recipients: recipients || "Both",
            priority: priority || "Normal",
            createdAt: new Date(),
            readBy: []
        })

        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${admin.name}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// Delete a memo (only the sender can delete)
app.get("/delete-memo/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        const memo = await MemoData.findOne({ _id: id })
        if (memo && memo.senderName === username) {
            await MemoData.findOneAndDelete({ _id: id })
        }
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// Mark memo as read
app.get("/read-memo/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await MemoData.updateOne(
            { _id: id },
            { $addToSet: { readBy: username } }
        )
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${username}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})


// ============================================================
// DEFER REQUEST ROUTES
// ============================================================

// Approve
app.get("/approve-defer/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DeferRequestData.updateOne({ _id: id }, { $set: { status: "Approved" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(username)}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// Deny
app.get("/deny-defer/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DeferRequestData.updateOne({ _id: id }, { $set: { status: "Denied" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(username)}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// Revoke back to Pending
app.get("/revoke-defer/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DeferRequestData.updateOne({ _id: id }, { $set: { status: "Pending" } })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(username)}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})

// Delete
app.get("/delete-defer/:id/:data", async (req, res) => {
    const id = req.params.id
    const data = req.params.data
    let username = data
    try {
        const parsed = JSON.parse(data)
        if (parsed && parsed.name) username = parsed.name
    } catch (e) { }

    if (!adminSessionActive(username)) return res.redirect("/admin-dashboad/admin-login")

    try {
        await DeferRequestData.findOneAndDelete({ _id: id })
        res.redirect(`/admin-dashboad/admin-voter-dashboad?name=${encodeURIComponent(username)}`)
    } catch (e) {
        console.log(e)
        res.send(e.message)
    }
})



module.exports = app