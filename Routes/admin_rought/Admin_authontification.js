require('dotenv').config()
const express = require("express")
const app = express.Router()
const nodemailer = require("nodemailer")
const Admin = require("../../DATABASE/Admin")

const emailAdress = process.env.SENDEREMAIL
const appPasword = process.env.APPLICATIONPASSWORD
const sendEmail = (email,password) => {

    const transporter = nodemailer.createTransport({
    service: "gmail", // Or your SMTP host 
    auth: {
        user: `${emailAdress}`,
        pass: `${appPasword}`  // Use an App Password, not your login password
    }
    });

   
    const mailOptions = {
    from: '"Nakuru Vocatio Training Center" <promisemukunya@gmail.com>',
    to: email,
    subject: "Password Recovary Email",
    text: `Your recoverd password is: ${password}`,
    html: `<h1>${password}</h1><p>Please use this code to complete your login.</p>` 
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
    });
}

const EmailUser = async (req,res,next)=>{
    let userEmail = req.query.email
    userEmail == null && res.redirect("/admin-dashboad/admin-login")
    let password = await Admin.findOne({email:userEmail})
    await sendEmail(userEmail,password.backupPassword)
    
    next();
}

app.get("/admin-password-mailer",EmailUser,(req,res)=>{
    return res.render('passwordrecovary', { data: "A Password has been sent to your Email Address" })
})

module.exports = app