require('dotenv').config()
const express = require("express")
const bcrypt = require("bcryptjs")
const app = express()
const Students = require("./DATABASE/Students")
const AdminData = require("./DATABASE/Admin")
const AdminDashboad = require("./Routes/admin_rought/Admin_dashoad")
const StudentDashboad = require("./Routes/students_rought/Student_dashoad")
const Authontificate = require("./Routes/students_rought/Login_authontificatio")
const AdminAuthontification = require("./Routes/admin_rought/Admin_authontification")
const DataUpload = require("./Routes/db_uploads/Enrollment_form")


app.set("view engine", "ejs")
app.use(express.static("static"))
app.use(express.static("scripts"))
app.use(express.static("Documents"))
app.use(express.urlencoded({extended:true}))
app.use(express.json());


async function ensureDefaultAdmin() {
    try {
        const defaultUser = process.env.ADMIN_USER
        const defaultPass = process.env.ADMIN_PASSWORD
        const defaultEmail = process.env.ADMIN_EMAIL
        const defaultFirst = process.env.ADMIN_FIRSTNAME
        const defaultSecond = process.env.ADMIN_SECONDNAME
        const defaultPrevilage = process.env.PREVILAGE

        const existing = await AdminData.find()

        if (existing <= 0) {
            const hash = await bcrypt.hash(defaultPass, 10)
            await AdminData.insertOne({
                name: { firstName: defaultFirst, secondName: defaultSecond },
                email: defaultEmail,
                userName: defaultUser,
                password: hash,
                backupPassword: defaultPass,
                prevlage:defaultPrevilage
            })
            console.log(`Created default admin '${defaultUser}'`)
        } else {
            console.log(`Default admin already exists`)
        }
    } catch (e) {
        console.error('Could not ensure default admin:', e.message)
    }
}

// Call ensureDefaultAdmin but don't block startup
ensureDefaultAdmin().catch(e => console.error('ensureDefaultAdmin error', e))//ensures a default admin is added in there is no admin


//======= routes midleware ==========
app.use("/admin-dashboad",AdminDashboad)//Admin Parent Rought
app.use("/student-dashboad",StudentDashboad)//Student Parent Rought
app.use("/authorizetion",Authontificate)//Student Authorization Rought
app.use("/admin-authorization",AdminAuthontification)//Admin Authorization Rought
app.use("/uploads",DataUpload)//data upload route


app.get("/",async (req,res)=>{
    const candidates = await Students.find()
    const candidatelength = candidates.length
    res.render("publickpage",{length:candidatelength})
})


app.get("/cources",(req,res)=>{
    res.render("courses")
})


app.get("/gallery",(req,res)=>{
    res.render("gallery")
})


app.get("/enrollment-form",(req,res)=>{
    res.render("enrollform")
})


app.get("/rules-and-regulations",(req,res)=>{
    res.render("rulesAndRegulation")
})


app.post("/password-backup",async (req, res)=>{
    const username = req.body.username
    const admin = await AdminData.find({userName:username})
    const adminlength = admin.length
    const message = "Admin not found"

    if (adminlength >= 1) {
        return res.redirect(`/admin-authorization/admin-password-mailer?email=${admin[0].email}`)
    }
    return res.render('passwordrecovary', { data: message })
})


app.get("/recover-password",(req, res)=>{
    const data = req.query.data
    res.render("passwordrecovary",{data:data})
})


app.get("/version/:name",(req,res)=>{
    const name = req.params.name
    name === "promise" ? res.render("v") : res.redirect("/")
})


app.use((req, res, next)=>{
    res.status(404).render("forfor")
})


app.listen(3000,()=>{
    console.log("server i raning on port 3000...")
})