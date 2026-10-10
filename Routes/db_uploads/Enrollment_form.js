require("dotenv").config
const express = require("express")
const app = express.Router()
const nodemailer = require("nodemailer")
const ErrolmentForm = require("../../DATABASE/EnrollmentForm")

const multer = require("multer")
const uploads = multer({dest: 'Uploads/'})


const emailAdress = process.env.SENDEREMAIL
const appPasword = process.env.APPLICATIONPASSWORD

const sendEmail = (email) => {

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
    subject: "Registration Form Confirmation",
    html: "<script></script><h2>Form Submitted Successfully!</h2>",
    text: `Thank you for submitting your form. Your request has been received and is now being processed. You will be notified once the review is complete.`
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log("Error:", error);
    }
    console.log("Email sent:", info.response);
    });
}

const EmailUser = async (req,res,next)=>{
    let userEmail = req.body.studentEmail
    await sendEmail(userEmail)
    
    next();
}

app.post("/enrollment_form_upload",uploads.array('resultSlipsPapers'),EmailUser, async (req,res)=>{
    const {
        surename,
        firstName,
        middleName,

        postalAdress,
        studentTel,
        studentEmail,
        dateOfBirth,
        studentIdOrPassport,
        entryDate,
        nationality,
        gender,
        maritalStatus,
        constituency,
        ward,

        courseApplied,
        level,
        duration,
        modeOfStudy,
        ExaminationBody,
        type,

        lastSchoolAttended,
        educationLevel,
        gradeAttained,

        healthProblem,
        disability,

        sports,
        dramaOrMusic,
        clubs,
        anyOther,

        suspended,
        resonForSuspension,
        convicted,
        resonForOffence,

        agrement,
        signatureOfApplicant,
        signatureDate,

        parentOrGuadianName,
        parentOrGuadianId,
        parentOrGuadianPostalAdress,
        parentOrGuadianTel,
        parentOrGuadianAlternativeContact,
        parentOrGuadianEmail,

        ParentName,
        parentContat,
        guardianName,
        guardianContact,
        sponsorName,
        sponsorContact,

        parentGuardianOrSponsorCommitment,
        parentGuardianOrSponsorName,
        parentGuardianOrSponsorSign,
        parentGuardianOrSponsorTel,
    } = req.body

    try{
        const enrollmentForm = await ErrolmentForm.insertOne({
            Enrollment:false,
            TraineeData:{
                Name:{
                    sureName:surename,
                    firstName:firstName,
                    middleName:middleName
                },
                ContactDetails:{
                    postalAdress:postalAdress,
                    studentTel:studentTel,
                    studentEmail:studentEmail
                },
                PersonalDetails:{
                    dateOfBirth:dateOfBirth,
                    studentIdOrPassport:studentIdOrPassport,
                    entryDate:entryDate,
                    nationality:nationality,
                    Gender:gender,
                    maritalStatus:maritalStatus,
                    constituency:constituency,
                    Ward:ward
                },
                CourseDetails:{
                    courseApplied:courseApplied,
                    level:level,
                    duration:duration,
                    modeOfStudy:modeOfStudy,
                    ExamBody:ExaminationBody,
                    type:type
                },
                EducationDetails:{
                    lastSchoolAttended:lastSchoolAttended,
                    educationLevel:educationLevel,
                    gradeAttained:gradeAttained,
                    proofOfEducation:req.files.map((file)=>file.path)////ARAY 
                },
                HealthDetails:{
                    healthProblem:healthProblem,
                    disability:disability,
                    medicalReport:req.files.map((file)=>file.path)////ARAY
                },
                CoCuricularActivities:{
                    sports:sports,
                    dramaOrMusic:dramaOrMusic,
                    clubs:clubs,
                    anyOther:anyOther
                },
                DisciplinaryDetails:{
                    schoolSuspension:{
                        suspended:suspended,
                        resonForSuspension:resonForSuspension
                    },
                    criminalConviction:{
                        convicted:convicted,
                        resonForOffence:resonForOffence
                    }
                },
                rulesAndRegulations:{
                    agrement:agrement,
                    signatureOfApplicant:signatureOfApplicant,
                    date:signatureDate
                }
            },
            ParentOrGuardianInformation:{
                Name:parentOrGuadianName,
                IdNoOrPassportNo:parentOrGuadianId,
                PostalAdress:parentOrGuadianPostalAdress,
                MobileNumber:parentOrGuadianTel,
                AltanativeContact:parentOrGuadianAlternativeContact,
                Email:parentOrGuadianEmail
            },
            FeesPayment:{
                Parent:{
                    ParentName:ParentName,
                    ParentContact:parentContat
                },
                Guardian:{
                    GuardianName:guardianName,
                    GuardianContact:guardianContact
                },
                Sponsor:{
                    SponsorName:sponsorName,
                    SponsorContact:sponsorContact
                }
            },
            Commitment:{
                Name:parentGuardianOrSponsorCommitment,
                ParentOrGuardianSighn:parentGuardianOrSponsorName,
                StudentSighn:parentGuardianOrSponsorSign,
                TellphoneNumber:parentGuardianOrSponsorTel
            },///////////
            OfficialUseOnly:{
                AdmissionOfficer:"none",
                Designation:"none",
                Signature:"none"
            },
            EnrollmentStatus:{
                AdmissionDetails:{
                    AdNo:"none",
                    AdDate:new Date().toDateString(),
                    Intake:"none"
                },
                ClassAsighnment:{
                    Depatment:"none",
                    Course:"none",
                    Instructor:"none"
                },
                Acomodation:{
                    Day: false,
                    Border:{
                        Border:true,
                        Domitry:"none",
                        RoomNo:1,
                        BedNo:1
                    }
                }
            }
        })
    }
    catch(e){
        ////console.log("Error in saving enrollment form data:", e.message)
        res.redirect("error-page")
    }

    
    res.status(200).redirect("upload-complition")
})



app.get("/upload-complition",(req,res)=>{
    res.render('enrollment_form_upload')
})

app.get("/error-page",(req,res)=>{
    res.render('file_Upload_error')
})


module.exports = app