require('dotenv').config()
const express = require("express")
const app = express.Router()
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const Students = require("../../DATABASE/Students")

const emailAdress = process.env.SENDEREMAIL
const appPasword = process.env.APPLICATIONPASSWORD

let otpStore = {}; // Store OTPs in memory for demonstration purposes

const N_otp = (min, max)=>{
    let otp = crypto.randomInt(min, max).toString(); // Generate a random 6-digit OTP
    console.log("Generated OTP:", otp); // Log the OTP for debugging purposes
    return otp;
}

const sendEmail = (email, admitionNo) => {
    let otp = N_otp(100000, 999999); // Generate a new OTP
    otpStore[admitionNo] = otp; // Store the OTP for later verification

    const transporter = nodemailer.createTransport({
    service: "gmail", // Or your SMTP host 
    auth: {
        user: `${emailAdress}`,
        pass: `${appPasword}` // Use an App Password, not your login password
    }
    });

   
    const mailOptions = {
    from: '"Nakuru Vocatio Training Center" <promisemukunya@gmail.com>',
    to: email,
    subject: "Two-Factor Authentication Code",
    text: `Your authentication code is: ${otp}`,
    html: `<h1>${otp}</h1><p>Please use this code to complete your login.</p>` 
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
    });
}

const EmailUser = async (req,res,next)=>{
    const admitionNo = req.query.admision
    admitionNo == null && res.redirect("/student-dashboad/login")
    const student = await Students.findOne({adimmisionNumber: admitionNo });
    await sendEmail(student.email,student.adimmisionNumber)
    
    next();
}

app.get("/two_factor_authontification",EmailUser,(req,res)=>{
    const name = req.query.username
    const admitionNo = req.query.admision
    res.render("studenttwofa",{
        name:name,
        adNo:admitionNo
    })
})


app.get("/two_factor_auth_data/:username/:admition/:code",(req,res)=>{
    const { username, admition, code } = req.params; 
    otpStore[admition] == code ? res.redirect(`/student-dashboad/session-check/${admition}/${username}`) : res.redirect(`/authorizetion/two_factor_authontification?username=${encodeURIComponent(username)}&admision=${encodeURIComponent(admition)}`);
    //read the stored otp and compare it with the code provided in the URL. If they match, redirect to the session check route; otherwise, redirect back to the two-factor authentication page.
});


app.get("/resend-code/:username/:admition",(req,res)=>{
    const { username, admition } = req.params;
    res.redirect(`/authorizetion/two_factor_authontification?username=${username}&admision=${admition}`);
});


module.exports = app